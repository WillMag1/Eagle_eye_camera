import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CameraViewfinder from "@/components/camera-viewfinder";
import ProcessingPanel from "@/components/processing-panel";
import ImagePreview from "@/components/image-preview";
import Gallery from "@/components/gallery";
import { ProcessingSettings } from "@shared/schema";

const defaultProcessingSettings: ProcessingSettings = {
  unsharpMask: {
    amount: 0.8,
    radius: 1.2,
    threshold: 0.05,
  },
  ycbcr: {
    y: 0,
    cb: 0,
    cr: 0,
  },
  contrast: 0,
  brightness: 0,
  saturation: 0,
  blend: {
    opacity: 50,
    mode: "average",
    imageCount: 0,
  },
};

export default function Camera() {
  const [processingPanelOpen, setProcessingPanelOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processingSettings, setProcessingSettings] = useState<ProcessingSettings>(defaultProcessingSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
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
    
    // Simulate processing time
    setTimeout(() => {
      setProcessedImage(imageDataUrl);
      setIsLoading(false);
      setImagePreviewOpen(true);
      toast({
        title: "Image captured successfully!",
        description: "Your image has been processed and is ready for preview.",
      });
    }, 1500);
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

  const handleResetFilters = () => {
    setProcessingSettings(defaultProcessingSettings);
    toast({
      title: "Filters reset",
      description: "All processing settings have been reset to default.",
    });
  };

  return (
    <div className="h-screen w-full relative camera-container camera-background overflow-hidden">
      <CameraViewfinder
        onCaptureImage={handleCaptureImage}
        onToggleProcessingPanel={() => setProcessingPanelOpen(!processingPanelOpen)}
        onOpenGallery={() => setGalleryOpen(true)}
        onToggleFlash={() => setFlashEnabled(!flashEnabled)}
        flashEnabled={flashEnabled}
        processingSettings={processingSettings}
      />

      <ProcessingPanel
        isOpen={processingPanelOpen}
        onClose={() => setProcessingPanelOpen(false)}
        processingSettings={processingSettings}
        onUpdateSettings={setProcessingSettings}
        onResetFilters={handleResetFilters}
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
            <div className="text-white/60 text-sm mt-1">Please wait</div>
          </div>
        </div>
      )}
    </div>
  );
}
