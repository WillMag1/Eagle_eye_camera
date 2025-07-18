import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Settings, Zap, ZapOff, Images } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { ProcessingSettings } from "@shared/schema";

interface CameraViewfinderProps {
  onCaptureImage: (imageDataUrl: string) => void;
  onOpenGallery: () => void;
}

export default function CameraViewfinder({
  onCaptureImage,
  onOpenGallery,
}: CameraViewfinderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { stream, error, startCamera, stopCamera, switchCamera, flashEnabled, toggleFlash } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Downscale for faster processing (max width 800px)
    const maxWidth = 800;
    const aspectRatio = video.videoHeight / video.videoWidth;
    const width = Math.min(video.videoWidth, maxWidth);
    const height = Math.round(width * aspectRatio);

    // Set canvas to downscaled dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw and downscale video frame to canvas
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, width, height);

    // Get image data and trigger capture
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onCaptureImage(imageDataUrl);

    // Flash effect
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 200);
  };

  const handleFocus = (e: React.TouchEvent<HTMLVideoElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    // Show focus indicator (placeholder implementation)
    console.log(`Focus at: ${x}, ${y}`);
  };

  if (error) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center text-white p-6 max-w-sm mx-4">
          <Camera className="h-16 w-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-xl font-medium mb-2">Camera Access Needed</h2>
          <p className="text-white/80 text-sm mb-4">
            Camera access is blocked in the Replit preview environment. 
            Deploy this app to use it on your Android device.
          </p>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-200 text-xs">
              Click the Deploy button to create a live version that works with your camera.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onTouchStart={handleFocus}
        />

        {/* Flash overlay */}
        {isRecording && (
          <div className="absolute inset-0 bg-white opacity-50 pointer-events-none" />
        )}

        {/* Camera Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-auto">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 camera-button touch-target"
                onClick={toggleFlash}
              >
                {flashEnabled ? (
                  <Zap className="h-5 w-5 text-white" />
                ) : (
                  <ZapOff className="h-5 w-5 text-white" />
                )}
              </Button>

              <div className="text-white text-sm font-medium no-select">
                Camera Pro
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 camera-button touch-target"
              >
                <Settings className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Center Focus Indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-16 h-16 border-2 border-white/60 rounded-lg" />
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
            <div className="flex justify-between items-center">
              {/* Gallery Thumbnail */}
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30 hover:border-white/50 camera-button touch-target"
                onClick={onOpenGallery}
              >
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <Images className="h-5 w-5 text-white/60" />
                </div>
              </Button>

              {/* Capture Button */}
              <Button
                variant="ghost"
                className="relative touch-target"
                onClick={handleCapture}
              >
                <div className="w-20 h-20 rounded-full bg-white border-4 border-[#FF5722] shadow-lg flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FF5722]" />
                </div>
              </Button>

              {/* Camera Switch Button */}
              <Button
                variant="ghost"
                size="icon"
                className="p-3 rounded-full camera-primary shadow-lg hover:camera-primary camera-button touch-target"
                onClick={switchCamera}
              >
                <Camera className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
