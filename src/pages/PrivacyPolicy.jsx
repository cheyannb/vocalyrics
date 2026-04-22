import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Last updated: April 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Introduction</h2>
            <p>
              Welcome to <span className="text-primary font-medium">VocaLyrics</span>. We are committed to protecting your personal information and being transparent about what we collect and how we use it. This Privacy Policy applies to your use of our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Information We Collect</h2>
            <p className="mb-3">We collect the following personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <span className="text-foreground font-medium">Email address</span> — collected during account registration and used to log you in, send account-related communications, and identify your account.
              </li>
              <li>
                <span className="text-foreground font-medium">Saved vocabulary & study progress</span> — words you bookmark and mastery levels you set, stored to provide a personalized learning experience.
              </li>
              <li>
                <span className="text-foreground font-medium">Song requests</span> — any song title, artist name, or notes you submit through the Request page.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To create and manage your account</li>
              <li>To authenticate you when you log in</li>
              <li>To save and display your vocabulary progress across sessions</li>
              <li>To process and review your song requests</li>
              <li>To send account-related emails (e.g. password resets, verification)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. Your email address and personal data are only used for the purposes described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You may request deletion of your account and associated data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please reach out to us through the Request page or via our contact information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Cookies</h2>
            <p>
              We may use browser storage (localStorage/sessionStorage) to maintain your login session and preferences. No third-party advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}