import { useState, useCallback, useRef } from "react";
import { requestCameraAccess, stopCameraStream, getCameraConstraints } from "@/lib/camera-utils";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (preferredFacingMode?: 'user' | 'environment') => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints = getCameraConstraints(preferredFacingMode || facingMode);
      const newStream = await requestCameraAccess(constraints);
      
      // Stop previous stream if it exists
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }

      streamRef.current = newStream;
      setStream(newStream);
      if (preferredFacingMode) {
        setFacingMode(preferredFacingMode);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setError(error instanceof Error ? error.message : 'Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    await startCamera(newFacingMode);
  }, [facingMode, startCamera]);

  const toggleFlash = useCallback(async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          });
          setFlashEnabled(!flashEnabled);
        } catch (error) {
          console.log('Flash not supported on this device');
        }
      }
    }
  }, [flashEnabled]);

  return {
    stream,
    error,
    isLoading,
    facingMode,
    flashEnabled,
    startCamera,
    stopCamera,
    switchCamera,
    toggleFlash,
  };
}
