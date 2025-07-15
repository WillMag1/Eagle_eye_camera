export interface ProcessingParams {
  unsharpRadius: number;    // Use 20 (default)
  unsharpStrength: number;  // Strength for sharpening (like Python 'strength'), e.g. 1.0 (default)
  brightnessFactor: number; // Like your brightness_factor, e.g. 1.1 (default)
  yContrastFactor: number;  // Y contrast factor, e.g. 0.6 (default)
  rgbContrastFactor: number;// RGB contrast factor, e.g. 1.7 (default)
}

/**
 * RGB to YCbCr conversion (same as Python)
 */
export function rgbToYCbCr(r: number, g: number, b: number): [number, number, number] {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
  return [y, cb, cr];
}

/**
 * YCbCr to RGB conversion (same as Python)
 */
export function ycbcrToRgb(y: number, cb: number, cr: number): [number, number, number] {
  const cbShifted = cb - 128;
  const crShifted = cr - 128;
  const r = y + 1.402 * crShifted;
  const g = y - 0.344136 * cbShifted - 0.714136 * crShifted;
  const b = y + 1.772 * cbShifted;
  return [r, g, b];
}

/**
 * Apply unsharp mask on Y channel only, like Python unsharp_mask_y
 */
export function unsharpMaskY(
  yChannel: Float32Array,
  width: number,
  height: number,
  radius: number,
  strength: number
): Float32Array {
  // For simplicity, create an offscreen canvas, draw Y as grayscale, apply Gaussian blur, then calculate mask

  // Create canvas & context
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Create ImageData from Y channel grayscale
  const yImageData = ctx.createImageData(width, height);
  for (let i = 0; i < yChannel.length; i++) {
    const val = Math.round(yChannel[i]);
    yImageData.data[i * 4] = val;
    yImageData.data[i * 4 + 1] = val;
    yImageData.data[i * 4 + 2] = val;
    yImageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(yImageData, 0, 0);

  // Apply Gaussian blur filter with radius
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(canvas, 0, 0);

  // Get blurred data
  const blurredData = ctx.getImageData(0, 0, width, height).data;

  // Calculate sharpened Y channel: y + strength * (y - blurred)
  const result = new Float32Array(yChannel.length);
  for (let i = 0; i < yChannel.length; i++) {
    const blurredVal = blurredData[i * 4]; // R channel of blurred grayscale
    let val = yChannel[i] + strength * (yChannel[i] - blurredVal);
    if (val < 0) val = 0;
    else if (val > 255) val = 255;
    result[i] = val;
  }
  return result;
}

/**
 * Apply contrast to a channel array (like Python apply_contrast)
 */
export function applyContrastChannel(channel: Float32Array, factor: number): Float32Array {
  const mean = channel.reduce((acc, v) => acc + v, 0) / channel.length;
  const result = new Float32Array(channel.length);
  for (let i = 0; i < channel.length; i++) {
    let val = (channel[i] - mean) * factor + mean;
    if (val < 0) val = 0;
    else if (val > 255) val = 255;
    result[i] = val;
  }
  return result;
}

/**
 * Intelligent brightness scaling on full RGB image, preserving color ratios (like Python)
 */
export function applyBrightnessScaling(
  rgb: Float32Array,
  width: number,
  height: number,
  factor: number
): Float32Array {
  const result = new Float32Array(rgb.length);
  for (let i = 0; i < width * height; i++) {
    const r = rgb[i * 3];
    const g = rgb[i * 3 + 1];
    const b = rgb[i * 3 + 2];
    const maxVal = Math.max(r, g, b);
    if (maxVal === 0) {
      result[i * 3] = 0;
      result[i * 3 + 1] = 0;
      result[i * 3 + 2] = 0;
      continue;
    }
    let scaledMax = maxVal * factor;
    if (scaledMax > 255) scaledMax = 255;
    const scale = scaledMax / maxVal;

    result[i * 3] = r * scale;
    result[i * 3 + 1] = g * scale;
    result[i * 3 + 2] = b * scale;
  }
  return result;
}

/**
 * Main process function:
 * Takes ImageData, returns new ImageData processed exactly as your Python pipeline
 */
export function processImageData(
  imageData: ImageData,
  params: ProcessingParams
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const inputData = imageData.data;

  // Step 1: Extract RGB channels to Float32Arrays
  const rChannel = new Float32Array(width * height);
  const gChannel = new Float32Array(width * height);
  const bChannel = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    rChannel[i] = inputData[i * 4];
    gChannel[i] = inputData[i * 4 + 1];
    bChannel[i] = inputData[i * 4 + 2];
  }

  // Step 2: Convert RGB to YCbCr arrays
  const yChannel = new Float32Array(width * height);
  const cbChannel = new Float32Array(width * height);
  const crChannel = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const [y, cb, cr] = rgbToYCbCr(rChannel[i], gChannel[i], bChannel[i]);
    yChannel[i] = y;
    cbChannel[i] = cb;
    crChannel[i] = cr;
  }

  // Step 3: Unsharp mask on Y channel
  const ySharp = unsharpMaskY(
    yChannel,
    width,
    height,
    params.unsharpRadius,
    params.unsharpStrength
  );

  // Step 4: Combine sharpened Y with original Cb, Cr
  // Convert back to RGB with sharpened Y but original chroma
  const rgbAfterSharp = new Float32Array(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    const [r, g, b] = ycbcrToRgb(ySharp[i], cbChannel[i], crChannel[i]);
    rgbAfterSharp[i * 3] = r;
    rgbAfterSharp[i * 3 + 1] = g;
    rgbAfterSharp[i * 3 + 2] = b;
  }

  // Step 5: Intelligent brightness scaling preserving ratios
  const brightScaled = applyBrightnessScaling(
    rgbAfterSharp,
    width,
    height,
    params.brightnessFactor
  );

  // Step 6: Convert brightness scaled RGB back to YCbCr for Y contrast
  const yChannel2 = new Float32Array(width * height);
  const cbChannel2 = new Float32Array(width * height);
  const crChannel2 = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const [y, cb, cr] = rgbToYCbCr(
      brightScaled[i * 3],
      brightScaled[i * 3 + 1],
      brightScaled[i * 3 + 2]
    );
    yChannel2[i] = y;
    cbChannel2[i] = cb;
    crChannel2[i] = cr;
  }

  // Step 7: Apply contrast on Y channel
  const yContrasted = applyContrastChannel(yChannel2, params.yContrastFactor);

  // Step 8: Convert back to RGB from Y (contrasted) + original CbCr
  const rgbAfterYContrast = new Float32Array(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    const [r, g, b] = ycbcrToRgb(yContrasted[i], cbChannel2[i], crChannel2[i]);
    rgbAfterYContrast[i * 3] = r;
    rgbAfterYContrast[i * 3 + 1] = g;
    rgbAfterYContrast[i * 3 + 2] = b;
  }

  // Step 9: Apply contrast on RGB channels
  const rContrasted = new Float32Array(width * height);
  const gContrasted = new Float32Array(width * height);
  const bContrasted = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    rContrasted[i] = rgbAfterYContrast[i * 3];
    gContrasted[i] = rgbAfterYContrast[i * 3 + 1];
    bContrasted[i] = rgbAfterYContrast[i * 3 + 2];
  }
  const rFinal = applyContrastChannel(rContrasted, params.rgbContrastFactor);
  const gFinal = applyContrastChannel(gContrasted, params.rgbContrastFactor);
  const bFinal = applyContrastChannel(bContrasted, params.rgbContrastFactor);

  // Step 10: Compose final ImageData
  const outputImageData = new ImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    outputImageData.data[i * 4] = Math.min(
      255,
      Math.max(0, Math.round(rFinal[i]))
    );
    outputImageData.data[i * 4 + 1] = Math.min(
      255,
      Math.max(0, Math.round(gFinal[i]))
    );
    outputImageData.data[i * 4 + 2] = Math.min(
      255,
      Math.max(0, Math.round(bFinal[i]))
    );
    outputImageData.data[i * 4 + 3] = 255; // fully opaque
  }

  return outputImageData;
}

/**
 * Resize ImageData proportionally, anchoring image center,
 * so aspect ratio remains and image is centered in target size
 */
export function resizeImageData(
  input: ImageData,
  targetWidth: number,
  targetHeight: number
): ImageData {
  // Calculate scale maintaining aspect ratio
  const scaleX = targetWidth / input.width;
  const scaleY = targetHeight / input.height;
  const scale = Math.min(scaleX, scaleY);

  const newWidth = Math.round(input.width * scale);
  const newHeight = Math.round(input.height * scale);

  // Create offscreen canvas for resizing
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  // Fill canvas with black (or transparent) background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Create temporary canvas to draw source ImageData
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = input.width;
  tempCanvas.height = input.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(input, 0, 0);

  // Calculate top-left to anchor center
  const offsetX = Math.floor((targetWidth - newWidth) / 2);
  const offsetY = Math.floor((targetHeight - newHeight) / 2);

  // Draw scaled image centered on target canvas
  ctx.drawImage(tempCanvas, 0, 0, input.width, input.height, offsetX, offsetY, newWidth, newHeight);

  // Get resized ImageData
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
    }
    
