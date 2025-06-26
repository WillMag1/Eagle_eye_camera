import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CameraViewfinder from "@/components/camera-viewfinder";
import ImagePreview from "@/components/image-preview";
import Gallery from "@/components/gallery";
import { processImage, ProcessingParams } from "@/lib/image-processing";
import { ProcessingSettings } from "@shared/schema";
import { Link } from "wouter";

// Processing parameters matching the Python workflow
const defaultProcessingParams: ProcessingParams = {
  unsharpRadius: 100,
  unsharpPercent: 100,
  unsharpThreshold: 0,
  yContrastStrength: 0.4,
  rgbContrastStrength: 2.0,
};

export default function Camera() {
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Prevent default touch behaviors that might interfere with the app
    const handleTouchMove = (e: TouchEvent) => {
      if (!(e.target as Element).closest('.camera-slider')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Handle orientation changes
    const handleOrientationChange = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleCaptureImage = async (imageDataUrl: string) => {
    setIsLoading(true);
    setCurrentImage(imageDataUrl);
    
    try {
      // Create image from data URL
      const img = new Image();
      img.onload = () => {
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply the Python PIL workflow processing
        const processedImageData = processImage(canvas, defaultProcessingParams);
        
        // Put processed data back to canvas
        ctx.putImageData(processedImageData, 0, 0);
        
        // Get processed image as data URL
        const processedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setProcessedImage(processedDataUrl);
        setIsLoading(false);
        setImagePreviewOpen(true);
        toast({
          title: "Image processed successfully!",
          description: "Applied unsharp mask, YCbCr processing, contrast adjustments, and blending.",
        });
      };
      img.src = imageDataUrl;
    } catch (error) {
      console.error('Image processing error:', error);
      setProcessedImage(imageDataUrl); // Fallback to original
      setIsLoading(false);
      setImagePreviewOpen(true);
      toast({
        title: "Processing completed",
        description: "Image captured successfully.",
        variant: "destructive",
      });
    }
  };

  const handleSaveImage = async () => {
    if (!processedImage) return;

    try {
      // Create download link
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `camera-pro-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Image saved!",
        description: "Your processed image has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to save the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Removed processing panel functionality - now just captures and auto-processes

  return (
    <div className="h-screen w-full relative camera-container camera-background overflow-hidden">
      <CameraViewfinder
        onCaptureImage={handleCaptureImage}
        onOpenGallery={() => setGalleryOpen(true)}
      />

      <ImagePreview
        isOpen={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
        imageData={processedImage}
        onSave={handleSaveImage}
        onRetake={() => {
          setImagePreviewOpen(false);
          setCurrentImage(null);
          setProcessedImage(null);
        }}
      />

      <Gallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="camera-surface rounded-2xl p-6 text-center">
            <div className="camera-loading mx-auto mb-4"></div>
            <div className="text-white font-medium">Processing Image...</div>
            <div className="text-white/60 text-sm mt-1">Applying unsharp mask, YCbCr, contrast, and blending</div>
          </div>
        </div>
      )}
      
      {/* Footer Links */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4 pointer-events-auto z-10">
        <Link href="/privacy">
          <button className="text-white/60 text-xs hover:text-white/90 transition-colors">
            Privacy Policy
          </button>
        </Link>
        <span className="text-white/40 text-xs">•</span>
        <Link href="/terms">
          <button className="text-white/60 text-xs hover:text-white/90 transition-colors">
            Terms of Service
          </button>
        </Link>
      </div>
    </div>
  );
}
