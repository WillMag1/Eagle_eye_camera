import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, RotateCcw, Download } from "lucide-react";

interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string | null;
  onSave: () => void;
  onRetake: () => void;
}

export default function ImagePreview({
  isOpen,
  onClose,
  imageData,
  onSave,
  onRetake,
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };

      img.src = imageData;
    }
  }, [isOpen, imageData]);

  const handleShare = async () => {
    if (!imageData) return;

    try {
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'camera-pro-image.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Camera Pro Image',
          text: 'Check out this photo I took with Camera Pro!',
        });
      } else {
        // Fallback to download
        onSave();
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      // Fallback to download
      onSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Preview Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 camera-button touch-target"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div className="text-white text-sm font-medium">Preview</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 camera-button touch-target"
          >
            <Share className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Canvas for processed image */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-24">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Preview Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onRetake}
            className="px-6 py-3 bg-black/40 backdrop-blur-sm text-white border-white/20 hover:bg-black/60"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake
          </Button>
          <Button
            onClick={onSave}
            className="px-6 py-3 camera-accent text-white hover:bg-[#FF5722]/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Save Image
          </Button>
        </div>
      </div>
    </div>
  );
}
