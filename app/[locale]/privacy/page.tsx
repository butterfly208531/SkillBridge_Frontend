import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: July 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">1. Introduction</h2>
            <p>
              SkillBridge Institute of Technology ("SkillBridge", "we", "us", or "our") is committed to protecting
              your personal information. This Privacy Policy explains how we collect, use, and safeguard the data
              you provide when using our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Name, email address, and phone number provided during registration or contact forms.</li>
              <li>Application details submitted through bootcamp enrollment forms.</li>
              <li>Usage data such as pages visited, time spent, and browser type (collected via analytics).</li>
              <li>Communications sent to us via email, Telegram, or contact forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To process your bootcamp applications and registrations.</li>
              <li>To send confirmation emails, program updates, and relevant announcements.</li>
              <li>To improve our website, courses, and user experience.</li>
              <li>To respond to your inquiries and provide support.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">4. Sharing of Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share data with trusted
              service providers who assist in operating our platform (e.g., payment processors, email services),
              subject to strict confidentiality agreements. We may also disclose information when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data against
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">6. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience. You can control cookie settings
              through your browser. Disabling cookies may affect some functionality of the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data, subject to legal requirements.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">8. Third-Party Links</h2>
            <p>
              Our website may contain links to external platforms (YouTube, Telegram, LinkedIn, etc.). We are
              not responsible for the privacy practices of those sites and encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated
              date. Continued use of our services after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li>📧 <a href="mailto:skillbridgeinstitituteoftech@gmail.com" className="text-[#2196F3] hover:underline">skillbridgeinstitituteoftech@gmail.com</a></li>
              <li>📞 +251 955 935 455 / +251 974 424 372</li>
              <li>📍 Addis Ababa, Ethiopia</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
