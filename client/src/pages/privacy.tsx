import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
          <h1 className="text-lg font-medium">Privacy Policy</h1>
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
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  <strong>Camera Data:</strong> Our app accesses your device camera to capture photos. 
                  Images are processed locally on your device for privacy and performance.
                </p>
                <p>
                  <strong>Processed Images:</strong> Photos you capture and process are stored locally in your browser. 
                  We do not upload or store your images on our servers.
                </p>
                <p>
                  <strong>Usage Analytics:</strong> We may collect anonymous usage data to improve app performance, 
                  including page views and feature usage statistics.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>Process and enhance your photos using advanced image processing algorithms</li>
                <li>Store your processed images locally for gallery viewing</li>
                <li>Improve app functionality and user experience</li>
                <li>Display relevant advertisements through Google AdSense</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Storage and Security</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  <strong>Local Storage:</strong> All your photos and settings are stored locally in your browser. 
                  This means your images never leave your device unless you choose to download or share them.
                </p>
                <p>
                  <strong>No Cloud Storage:</strong> We do not store your images on remote servers or cloud services.
                </p>
                <p>
                  <strong>Browser Security:</strong> Your data is protected by your browser's built-in security features.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. 
                  Google may collect data about your visits to this and other websites to provide relevant ads.
                </p>
                <p>
                  <strong>Analytics:</strong> We may use analytics services to understand how users interact with our app.
                </p>
                <p>
                  You can learn more about Google's privacy practices at: 
                  <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline ml-1">
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Camera Permissions</h2>
              <div className="space-y-3 text-white/80">
                <p>
                  This app requires camera access to capture photos. Camera permission is requested only when needed 
                  and you can revoke this permission at any time through your browser settings.
                </p>
                <p>
                  Camera access is used exclusively for photo capture within the app. We do not access your camera 
                  for any other purpose or when the app is not actively being used.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>Clear your local data at any time through browser settings</li>
                <li>Revoke camera permissions through browser settings</li>
                <li>Control ad preferences through Google Ad Settings</li>
                <li>Contact us with privacy concerns or questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
              <p className="text-white/80">
                This app is not directed to children under 13. We do not knowingly collect personal information 
                from children under 13. If you believe we have collected such information, please contact us 
                to have it removed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-white/80">
                We may update this privacy policy from time to time. We will notify users of any material changes 
                by updating the "Last updated" date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-white/80">
                If you have any questions about this Privacy Policy, please contact us through the app's 
                feedback system or at the contact information provided in our Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}