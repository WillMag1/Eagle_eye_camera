/**
 * Image processing utilities for advanced camera features
 */

export interface ImageProcessingOptions {
  unsharpMask?: {
    amount: number;
    radius: number;
    threshold: number;
  };
  ycbcr?: {
    y: number;
    cb: number;
    cr: number;
  };
  contrast?: number;
  brightness?: number;
  saturation?: number;
}

/**
 * RGB to YCbCr color space conversion
 */
export function rgbToYCbCr(r: number, g: number, b: number): [number, number, number] {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
  const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
  return [y, cb, cr];
}

/**
 * YCbCr to RGB color space conversion
 */
export function ycbcrToRgb(y: number, cb: number, cr: number): [number, number, number] {
  const r = y + 1.402 * (cr - 128);
  const g = y - 0.344 * (cb - 128) - 0.714 * (cr - 128);
  const b = y + 1.772 * (cb - 128);
  return [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))];
}

/**
 * Apply unsharp mask filter to image data
 */
export function applyUnsharpMask(
  imageData: ImageData,
  amount: number = 0.8,
  radius: number = 1.2,
  threshold: number = 0.05
): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  // Create gaussian blur for unsharp mask
  const blurredData = applyGaussianBlur(imageData, radius);
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const originalR = imageData.data[i];
    const originalG = imageData.data[i + 1];
    const originalB = imageData.data[i + 2];
    const originalA = imageData.data[i + 3];

    const blurredR = blurredData.data[i];
    const blurredG = blurredData.data[i + 1];
    const blurredB = blurredData.data[i + 2];

    // Calculate mask
    const maskR = originalR - blurredR;
    const maskG = originalG - blurredG;
    const maskB = originalB - blurredB;

    // Apply threshold
    if (Math.abs(maskR) < threshold * 255 && 
        Math.abs(maskG) < threshold * 255 && 
        Math.abs(maskB) < threshold * 255) {
      result.data[i] = originalR;
      result.data[i + 1] = originalG;
      result.data[i + 2] = originalB;
    } else {
      result.data[i] = Math.max(0, Math.min(255, originalR + amount * maskR));
      result.data[i + 1] = Math.max(0, Math.min(255, originalG + amount * maskG));
      result.data[i + 2] = Math.max(0, Math.min(255, originalB + amount * maskB));
    }
    result.data[i + 3] = originalA;
  }

  return result;
}

/**
 * Apply Gaussian blur to image data
 */
export function applyGaussianBlur(imageData: ImageData, radius: number): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  // Use canvas filter for gaussian blur (more efficient than manual convolution)
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(canvas, 0, 0);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Apply YCbCr color space manipulation
 */
export function applyYCbCrAdjustment(
  imageData: ImageData,
  yAdjust: number,
  cbAdjust: number,
  crAdjust: number
): ImageData {
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    // Convert to YCbCr
    let [y, cb, cr] = rgbToYCbCr(r, g, b);

    // Apply adjustments
    y = Math.max(0, Math.min(255, y + yAdjust));
    cb = Math.max(0, Math.min(255, cb + cbAdjust));
    cr = Math.max(0, Math.min(255, cr + crAdjust));

    // Convert back to RGB
    const [newR, newG, newB] = ycbcrToRgb(y, cb, cr);

    result.data[i] = newR;
    result.data[i + 1] = newG;
    result.data[i + 2] = newB;
    result.data[i + 3] = a;
  }

  return result;
}

/**
 * Apply contrast adjustment
 */
export function applyContrast(imageData: ImageData, contrast: number): ImageData {
  const result = new ImageData(imageData.width, imageData.height);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < imageData.data.length; i += 4) {
    result.data[i] = Math.max(0, Math.min(255, factor * (imageData.data[i] - 128) + 128));
    result.data[i + 1] = Math.max(0, Math.min(255, factor * (imageData.data[i + 1] - 128) + 128));
    result.data[i + 2] = Math.max(0, Math.min(255, factor * (imageData.data[i + 2] - 128) + 128));
    result.data[i + 3] = imageData.data[i + 3];
  }

  return result;
}

/**
 * Apply brightness adjustment
 */
export function applyBrightness(imageData: ImageData, brightness: number): ImageData {
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    result.data[i] = Math.max(0, Math.min(255, imageData.data[i] + brightness));
    result.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + brightness));
    result.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + brightness));
    result.data[i + 3] = imageData.data[i + 3];
  }

  return result;
}

/**
 * Apply saturation adjustment
 */
export function applySaturation(imageData: ImageData, saturation: number): ImageData {
  const result = new ImageData(imageData.width, imageData.height);
  const factor = saturation / 100;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    result.data[i] = Math.max(0, Math.min(255, luminance + factor * (r - luminance)));
    result.data[i + 1] = Math.max(0, Math.min(255, luminance + factor * (g - luminance)));
    result.data[i + 2] = Math.max(0, Math.min(255, luminance + factor * (b - luminance)));
    result.data[i + 3] = imageData.data[i + 3];
  }

  return result;
}

/**
 * Apply average blending between two images
 */
export function applyAverageBlending(
  baseImageData: ImageData,
  blendImageData: ImageData,
  opacity: number = 0.5
): ImageData {
  const result = new ImageData(baseImageData.width, baseImageData.height);

  for (let i = 0; i < baseImageData.data.length; i += 4) {
    const baseR = baseImageData.data[i];
    const baseG = baseImageData.data[i + 1];
    const baseB = baseImageData.data[i + 2];
    const baseA = baseImageData.data[i + 3];

    const blendR = blendImageData.data[i] || 0;
    const blendG = blendImageData.data[i + 1] || 0;
    const blendB = blendImageData.data[i + 2] || 0;

    result.data[i] = Math.round(baseR * (1 - opacity) + (baseR + blendR) / 2 * opacity);
    result.data[i + 1] = Math.round(baseG * (1 - opacity) + (baseG + blendG) / 2 * opacity);
    result.data[i + 2] = Math.round(baseB * (1 - opacity) + (baseB + blendB) / 2 * opacity);
    result.data[i + 3] = baseA;
  }

  return result;
}

/**
 * Process image with all specified options
 */
export function processImage(
  canvas: HTMLCanvasElement,
  options: ImageProcessingOptions
): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply brightness
  if (options.brightness !== undefined && options.brightness !== 0) {
    imageData = applyBrightness(imageData, options.brightness);
  }

  // Apply contrast
  if (options.contrast !== undefined && options.contrast !== 0) {
    imageData = applyContrast(imageData, options.contrast);
  }

  // Apply saturation
  if (options.saturation !== undefined && options.saturation !== 0) {
    imageData = applySaturation(imageData, options.saturation);
  }

  // Apply YCbCr adjustments
  if (options.ycbcr) {
    const { y, cb, cr } = options.ycbcr;
    if (y !== 0 || cb !== 0 || cr !== 0) {
      imageData = applyYCbCrAdjustment(imageData, y, cb, cr);
    }
  }

  // Apply unsharp mask
  if (options.unsharpMask) {
    const { amount, radius, threshold } = options.unsharpMask;
    if (amount > 0 && radius > 0) {
      imageData = applyUnsharpMask(imageData, amount, radius, threshold);
    }
  }

  return imageData;
}
