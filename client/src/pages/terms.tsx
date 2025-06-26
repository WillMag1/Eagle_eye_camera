import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-white/80">
                By accessing and using Camera Pro, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Description</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  Camera Pro is a web-based camera application that provides professional-grade image processing 
                  capabilities including unsharp mask filters, color space adjustments, and advanced blending effects.
                </p>
                <p>
                  The service processes images locally on your device using advanced algorithms equivalent to 
                  professional photo editing software.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>You are responsible for all content you capture and process using this app</li>
                <li>You must not use the app for any illegal or unauthorized purpose</li>
                <li>You must not take photos of people without their consent where required by law</li>
                <li>You are responsible for complying with local privacy and photography laws</li>
                <li>You must not attempt to reverse engineer or modify the app's functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Camera and Device Access</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  This app requires access to your device's camera to function. Camera access is used exclusively 
                  for capturing photos within the app interface.
                </p>
                <p>
                  You may revoke camera permissions at any time through your browser settings, though this will 
                  prevent the app from functioning properly.
                </p>
                <p>
                  We do not access your camera when the app is not actively being used or in the foreground.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  <strong>Your Content:</strong> You retain all rights to photos you capture using this app. 
                  We do not claim ownership of your images or processed content.
                </p>
                <p>
                  <strong>App Technology:</strong> The image processing algorithms, user interface, and app functionality 
                  are protected by intellectual property rights.
                </p>
                <p>
                  <strong>Usage Rights:</strong> You may use processed images for personal or commercial purposes. 
                  Attribution to Camera Pro is appreciated but not required.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data and Privacy</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  All image processing occurs locally on your device. Your photos are not uploaded to our servers 
                  or stored in the cloud unless you explicitly choose to download or share them.
                </p>
                <p>
                  Please refer to our Privacy Policy for detailed information about data collection and usage.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  We strive to maintain consistent service availability, but cannot guarantee uninterrupted access. 
                  The service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
                <p>
                  Processing performance may vary based on your device capabilities and browser compatibility.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Disclaimers and Limitations</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  <strong>Service Quality:</strong> While we strive for high-quality image processing, results may vary 
                  based on source image quality and device capabilities.
                </p>
                <p>
                  <strong>Device Compatibility:</strong> The app requires a modern browser with camera API support. 
                  Some older devices may not be fully compatible.
                </p>
                <p>
                  <strong>Data Loss:</strong> We are not responsible for loss of images or data. We recommend 
                  downloading important processed images promptly.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Prohibited Uses</h2>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>Using the app for any unlawful purpose or activity</li>
                <li>Attempting to gain unauthorized access to app systems or user data</li>
                <li>Uploading or processing content that violates others' intellectual property rights</li>
                <li>Using the app to create content that is harmful, offensive, or inappropriate</li>
                <li>Attempting to reverse engineer, modify, or distribute the app's code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Advertising</h2>
              <p className="text-white/80">
                This app displays advertisements through Google AdSense to support ongoing development and hosting. 
                Ad content is managed by Google and we do not control specific advertisements shown.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Modifications to Terms</h2>
              <p className="text-white/80">
                We reserve the right to modify these terms at any time. Material changes will be communicated 
                by updating the "Last updated" date. Continued use of the app after changes constitutes 
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Termination</h2>
              <p className="text-white/80">
                You may stop using the app at any time. We reserve the right to terminate or suspend access 
                for violations of these terms or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  For questions about these Terms of Service, please contact us through the app interface 
                  or at our official communication channels.
                </p>
                <p>
                  For privacy-related questions, please refer to our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
              <p className="text-white/80">
                These terms shall be governed and construed in accordance with applicable local laws. 
                Any disputes shall be resolved through appropriate legal channels in the jurisdiction 
                where the service is provided.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}