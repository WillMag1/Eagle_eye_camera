import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Check } from "lucide-react";
import { ProcessingSettings } from "@shared/schema";

interface ProcessingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  processingSettings: ProcessingSettings;
  onUpdateSettings: (settings: ProcessingSettings) => void;
  onResetFilters: () => void;
}

export default function ProcessingPanel({
  isOpen,
  onClose,
  processingSettings,
  onUpdateSettings,
  onResetFilters,
}: ProcessingPanelProps) {
  const [currentTab, setCurrentTab] = useState<'filters' | 'adjust' | 'blend'>('filters');

  const updateUnsharpMask = (field: keyof ProcessingSettings['unsharpMask'], value: number) => {
    onUpdateSettings({
      ...processingSettings,
      unsharpMask: {
        ...processingSettings.unsharpMask,
        [field]: value,
      },
    });
  };

  const updateYCbCr = (field: keyof ProcessingSettings['ycbcr'], value: number) => {
    onUpdateSettings({
      ...processingSettings,
      ycbcr: {
        ...processingSettings.ycbcr,
        [field]: value,
      },
    });
  };

  const updateSetting = (field: keyof ProcessingSettings, value: any) => {
    onUpdateSettings({
      ...processingSettings,
      [field]: value,
    });
  };

  const updateBlend = (field: keyof ProcessingSettings['blend'], value: any) => {
    onUpdateSettings({
      ...processingSettings,
      blend: {
        ...processingSettings.blend,
        [field]: value,
      },
    });
  };

  return (
    <div
      className={`absolute inset-x-0 bottom-0 camera-surface rounded-t-3xl shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      } z-40`}
      style={{ maxHeight: '80vh' }}
    >
      <div className="p-6 overflow-y-auto max-h-full">
        {/* Panel Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">Image Processing</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 camera-button"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Processing Tabs */}
        <div className="flex mb-6 bg-black/30 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
              currentTab === 'filters'
                ? 'camera-primary text-white'
                : 'text-white/60 hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('filters')}
          >
            Filters
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
              currentTab === 'adjust'
                ? 'camera-primary text-white'
                : 'text-white/60 hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('adjust')}
          >
            Adjust
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
              currentTab === 'blend'
                ? 'camera-primary text-white'
                : 'text-white/60 hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('blend')}
          >
            Blend
          </Button>
        </div>

        {/* Filters Tab Content */}
        {currentTab === 'filters' && (
          <div className="space-y-6">
            {/* Unsharp Mask */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Unsharp Mask
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Amount</span>
                    <span>{processingSettings.unsharpMask.amount}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={processingSettings.unsharpMask.amount}
                    onChange={(e) => updateUnsharpMask('amount', parseFloat(e.target.value))}
                    className="camera-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Radius</span>
                    <span>{processingSettings.unsharpMask.radius}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={processingSettings.unsharpMask.radius}
                    onChange={(e) => updateUnsharpMask('radius', parseFloat(e.target.value))}
                    className="camera-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Threshold</span>
                    <span>{processingSettings.unsharpMask.threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={processingSettings.unsharpMask.threshold}
                    onChange={(e) => updateUnsharpMask('threshold', parseFloat(e.target.value))}
                    className="camera-slider"
                  />
                </div>
              </div>
            </div>

            {/* YCbCr Manipulation */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                YCbCr Color Space
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Luminance (Y)</span>
                    <span>{processingSettings.ycbcr.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={processingSettings.ycbcr.y}
                    onChange={(e) => updateYCbCr('y', parseInt(e.target.value))}
                    className="camera-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Blue Chroma (Cb)</span>
                    <span>{processingSettings.ycbcr.cb}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={processingSettings.ycbcr.cb}
                    onChange={(e) => updateYCbCr('cb', parseInt(e.target.value))}
                    className="camera-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Red Chroma (Cr)</span>
                    <span>{processingSettings.ycbcr.cr}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={processingSettings.ycbcr.cr}
                    onChange={(e) => updateYCbCr('cr', parseInt(e.target.value))}
                    className="camera-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adjust Tab Content */}
        {currentTab === 'adjust' && (
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Contrast
              </label>
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Contrast</span>
                  <span>{processingSettings.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={processingSettings.contrast}
                  onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
                  className="camera-slider"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Brightness
              </label>
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Brightness</span>
                  <span>{processingSettings.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={processingSettings.brightness}
                  onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
                  className="camera-slider"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Saturation
              </label>
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Saturation</span>
                  <span>{processingSettings.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={processingSettings.saturation}
                  onChange={(e) => updateSetting('saturation', parseInt(e.target.value))}
                  className="camera-slider"
                />
              </div>
            </div>
          </div>
        )}

        {/* Blend Tab Content */}
        {currentTab === 'blend' && (
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Average Blending
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant="outline"
                  className="p-3 border-white/20 rounded-lg bg-transparent hover:bg-white/10 text-white"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">+</div>
                    <div className="text-xs">Add Image</div>
                  </div>
                </Button>
                <div className="p-3 border border-white/20 rounded-lg bg-black/30">
                  <div className="text-xs text-white/60 mb-2">
                    Images: <span>{processingSettings.blend.imageCount}</span>
                  </div>
                  <div className="text-xs text-white/40">Ready to blend</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Blend Opacity</span>
                  <span>{processingSettings.blend.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={processingSettings.blend.opacity}
                  onChange={(e) => updateBlend('opacity', parseInt(e.target.value))}
                  className="camera-slider"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Blend Mode
              </label>
              <select
                className="w-full p-3 bg-black/40 text-white rounded-lg border border-white/20"
                value={processingSettings.blend.mode}
                onChange={(e) => updateBlend('mode', e.target.value)}
              >
                <option value="average">Average</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="softlight">Soft Light</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            className="flex-1 py-3 px-4 bg-black/40 text-white border-white/20 hover:bg-black/60"
            onClick={onResetFilters}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            className="flex-1 py-3 px-4 camera-primary text-white hover:camera-primary"
            onClick={onClose}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
