import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare, Image } from "lucide-react";
import AdBanner from "./ad-banner";

interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Gallery({ isOpen, onClose }: GalleryProps) {
  if (!isOpen) return null;

  // Placeholder data for demo - in real app this would come from storage
  const placeholderImages = [
    { id: 1, name: 'Sharp+', color: 'from-blue-900 to-blue-800' },
    { id: 2, name: 'Contrast', color: 'from-green-900 to-green-800' },
    { id: 3, name: 'YCbCr', color: 'from-purple-900 to-purple-800' },
  ];

  return (
    <div className="fixed inset-0 camera-background z-40 flex flex-col">
      {/* Gallery Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 camera-button touch-target"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h2 className="text-lg font-medium text-white">Gallery</h2>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-white/10 camera-button touch-target"
          >
            <CheckSquare className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          {placeholderImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
            >
              <div className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center`}>
                <Image className="text-white/40 h-8 w-8" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <div className="text-xs text-white/80">{image.name}</div>
              </div>
            </div>
          ))}

          {/* Empty state placeholder */}
          <div className="col-span-3 text-center py-8">
            <Image className="h-16 w-16 mx-auto text-white/40 mb-4" />
            <p className="text-white/60 text-sm">
              Captured images will appear here
            </p>
          </div>
        </div>
        
        {/* Ad placement at bottom of gallery */}
        <div className="mt-6 mb-4 px-2">
          <AdBanner 
            adSlot="1234567890"
            className="w-full"
            format="horizontal"
          />
        </div>
      </div>
    </div>
  );
}
