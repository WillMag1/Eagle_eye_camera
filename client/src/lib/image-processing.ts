/**
 * Image processing utilities matching the exact Python PIL workflow
 */

export interface ProcessingParams {
  unsharpRadius: number;
  unsharpPercent: number;
  unsharpThreshold: number;
  yContrastStrength: number;
  rgbContrastStrength: number;
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
 * Apply unsharp mask filter matching PIL's UnsharpMask
 */
export function applyUnsharpMask(
  imageData: ImageData,
  radius: number = 100,
  percent: number = 100,
  threshold: number = 0
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
  const amount = percent / 100;

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

    // Apply threshold (PIL style)
    if (Math.abs(maskR) < threshold && 
        Math.abs(maskG) < threshold && 
        Math.abs(maskB) < threshold) {
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
 * Process image following the exact Python PIL workflow
 */
export function processImage(
  canvas: HTMLCanvasElement,
  params: ProcessingParams = {
    unsharpRadius: 100,
    unsharpPercent: 100,
    unsharpThreshold: 0,
    yContrastStrength: 0.4,
    rgbContrastStrength: 2.0
  }
): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Get original image data
  const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // ---------- IMAGE 1 PROCESSING ----------
  // Apply UnsharpMask to original image (on RGB)
  const img1 = applyUnsharpMask(originalImageData, params.unsharpRadius, params.unsharpPercent, params.unsharpThreshold);

  // Convert both original and img1 to YCbCr, then replace Cb and Cr in img1 with those from original
  const img1_ycbcr = replaceChromaChannels(img1, originalImageData);

  // ---------- IMAGE 2 PROCESSING ----------
  // Apply Y contrast (0.4 strength) then RGB contrast (2.0)
  const img2 = applyContrastWorkflow(img1_ycbcr, params.yContrastStrength, params.rgbContrastStrength);

  // ---------- BLENDING ----------
  // Average blend the two processed images
  const blended = applyAverageBlending(img1_ycbcr, img2, 0.5);

  return blended;
}

/**
 * Replace Cb and Cr channels from img1 with those from original (step from Python code)
 */
function replaceChromaChannels(img1: ImageData, original: ImageData): ImageData {
  const result = new ImageData(img1.width, img1.height);

  for (let i = 0; i < img1.data.length; i += 4) {
    const r1 = img1.data[i];
    const g1 = img1.data[i + 1];
    const b1 = img1.data[i + 2];
    const a1 = img1.data[i + 3];

    const r_orig = original.data[i];
    const g_orig = original.data[i + 1];
    const b_orig = original.data[i + 2];

    // Convert to YCbCr
    const [y1, _, __] = rgbToYCbCr(r1, g1, b1);
    const [___, cb_orig, cr_orig] = rgbToYCbCr(r_orig, g_orig, b_orig);

    // Merge Y from img1 with Cb,Cr from original
    const [newR, newG, newB] = ycbcrToRgb(y1, cb_orig, cr_orig);

    result.data[i] = newR;
    result.data[i + 1] = newG;
    result.data[i + 2] = newB;
    result.data[i + 3] = a1;
  }

  return result;
}

/**
 * Apply contrast workflow: Y contrast first, then RGB contrast
 */
function applyContrastWorkflow(imageData: ImageData, yContrastStrength: number, rgbContrastStrength: number): ImageData {
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    // Convert to YCbCr
    let [y, cb, cr] = rgbToYCbCr(r, g, b);

    // Apply Y contrast (0.4 strength means reduce contrast)
    y = applyContrastToChannel(y, yContrastStrength);

    // Convert back to RGB
    let [newR, newG, newB] = ycbcrToRgb(y, cb, cr);

    // Apply RGB contrast (2.0 strength)
    newR = applyContrastToChannel(newR, rgbContrastStrength);
    newG = applyContrastToChannel(newG, rgbContrastStrength);
    newB = applyContrastToChannel(newB, rgbContrastStrength);

    result.data[i] = Math.max(0, Math.min(255, newR));
    result.data[i + 1] = Math.max(0, Math.min(255, newG));
    result.data[i + 2] = Math.max(0, Math.min(255, newB));
    result.data[i + 3] = a;
  }

  return result;
}

/**
 * Apply contrast to a single channel (matches PIL's ImageEnhance.Contrast)
 */
function applyContrastToChannel(value: number, factor: number): number {
  // PIL's contrast enhancement: new_value = mean + factor * (old_value - mean)
  // Using 128 as the mean for 8-bit values
  const mean = 128;
  return mean + factor * (value - mean);
}
