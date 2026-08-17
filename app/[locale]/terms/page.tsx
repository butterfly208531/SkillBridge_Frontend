import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { PageViewTracker } from "@/app/[locale]/components/page-view-tracker";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PageViewTracker page="/terms" />
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the SkillBridge Institute of Technology website and services, you agree to
              be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">2. Use of Services</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You must be at least 16 years old to register for a bootcamp.</li>
              <li>You agree to provide accurate and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree not to misuse our platform, including attempting to gain unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">3. Enrollment and Payments</h2>
            <p>
              Enrollment in a bootcamp is confirmed upon receipt of full or agreed partial payment. Payment terms,
              installment plans, and scholarship conditions will be communicated at the time of registration.
              Fees are non-refundable unless otherwise specified in writing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">4. Intellectual Property</h2>
            <p>
              All course materials, videos, documents, and content provided by SkillBridge are the intellectual
              property of SkillBridge Institute of Technology. You may not reproduce, distribute, or create
              derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">5. Student Conduct</h2>
            <p>
              Students are expected to maintain respectful conduct in all learning environments, including online
              communities, live sessions, and group projects. SkillBridge reserves the right to remove any
              student who violates this standard without a refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">6. Certificates</h2>
            <p>
              Certificates of completion are awarded to students who successfully complete the required coursework
              and assessments. SkillBridge certificates are issued solely by SkillBridge Institute of Technology
              and do not imply affiliation with any third-party organization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">7. Limitation of Liability</h2>
            <p>
              SkillBridge is not liable for any indirect, incidental, or consequential damages arising from the
              use of our services. We do not guarantee specific employment outcomes, salary levels, or career
              results following course completion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">8. Modifications to Services</h2>
            <p>
              SkillBridge reserves the right to modify, suspend, or discontinue any part of our services at any
              time. We will provide reasonable notice of significant changes where possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any disputes
              arising from these Terms shall be subject to the jurisdiction of Ethiopian courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">10. Contact Us</h2>
            <p>For questions regarding these Terms, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li>📧 <a href="mailto:skillbridgeinstitituteoftech@gmail.com" className="text-[#2196F3] hover:underline">skillbridgeinstitituteoftech@gmail.com</a></li>
              <li>📞 +251-955-935-455 / +251-974-424-372</li>
              <li>📍 Addis Ababa, Ethiopia</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
