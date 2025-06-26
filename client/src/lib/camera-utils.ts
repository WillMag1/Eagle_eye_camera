/**
 * Camera utility functions for device access and constraints
 */

export interface CameraConstraints {
  video: {
    facingMode?: 'user' | 'environment';
    width?: { ideal: number };
    height?: { ideal: number };
    frameRate?: { ideal: number };
  };
  audio: false;
}

/**
 * Get optimal camera constraints for mobile Android devices (downscaled for faster processing)
 */
export function getCameraConstraints(facingMode: 'user' | 'environment' = 'environment'): CameraConstraints {
  return {
    video: {
      facingMode,
      width: { ideal: 1280 },  // Reduced from 1920 for faster processing
      height: { ideal: 720 },  // Reduced from 1080 for faster processing
      frameRate: { ideal: 30 },
    },
    audio: false,
  };
}

/**
 * Check if the device supports camera access
 */
export function isCameraSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Get available camera devices
 */
export async function getCameraDevices(): Promise<MediaDeviceInfo[]> {
  if (!isCameraSupported()) {
    throw new Error('Camera not supported on this device');
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error enumerating camera devices:', error);
    return [];
  }
}

/**
 * Request camera access with specified constraints
 */
export async function requestCameraAccess(constraints: CameraConstraints): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new Error('Camera not supported on this device');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError':
          throw new Error('Camera access denied. Please allow camera permissions in your browser settings.');
        case 'NotFoundError':
          throw new Error('No camera found on this device.');
        case 'NotReadableError':
          throw new Error('Camera is already in use by another application.');
        case 'OverconstrainedError':
          throw new Error('Camera constraints cannot be satisfied.');
        case 'SecurityError':
          throw new Error('Camera access blocked due to security restrictions.');
        default:
          throw new Error(`Camera error: ${error.message}`);
      }
    }
    
    throw new Error('Unknown camera error occurred');
  }
}

/**
 * Stop camera stream and release resources
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
}

/**
 * Capture and downscale image from video element for faster processing
 */
export function captureImageFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  quality: number = 0.8,
  maxWidth: number = 800  // Downscale for faster processing
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Calculate downscaled dimensions
  let { width, height } = calculateDownscaledDimensions(
    video.videoWidth, 
    video.videoHeight, 
    maxWidth
  );

  // Set canvas to downscaled dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw and downscale video frame to canvas
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, width, height);

  // Return image as data URL
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Calculate downscaled dimensions while maintaining aspect ratio
 */
function calculateDownscaledDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number
): { width: number; height: number } {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalHeight / originalWidth;
  const width = maxWidth;
  const height = Math.round(width * aspectRatio);
  
  return { width, height };
}

/**
 * Check if device has multiple cameras
 */
export async function hasMultipleCameras(): Promise<boolean> {
  try {
    const devices = await getCameraDevices();
    return devices.length > 1;
  } catch (error) {
    console.error('Error checking camera count:', error);
    return false;
  }
}

/**
 * Switch between front and back cameras
 */
export async function switchCamera(
  currentStream: MediaStream | null,
  currentFacingMode: 'user' | 'environment'
): Promise<{ stream: MediaStream; facingMode: 'user' | 'environment' }> {
  // Stop current stream
  stopCameraStream(currentStream);

  // Switch facing mode
  const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  
  // Get new stream with switched camera
  const constraints = getCameraConstraints(newFacingMode);
  const stream = await requestCameraAccess(constraints);

  return { stream, facingMode: newFacingMode };
}

/**
 * Get device orientation for proper image rotation
 */
export function getDeviceOrientation(): number {
  if ('orientation' in window) {
    return Math.abs(window.orientation as number);
  }
  
  // Fallback to screen dimensions
  return window.innerHeight > window.innerWidth ? 0 : 90;
}

/**
 * Apply image rotation based on device orientation
 */
export function rotateImageData(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  rotation: number
): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Temporary canvas context not available');

  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  tempCtx.putImageData(imageData, 0, 0);

  // Apply rotation
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
  ctx.restore();

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
