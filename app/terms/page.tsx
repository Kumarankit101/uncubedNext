import type { Metadata } from 'next';

// Force static generation - content rarely changes
export const dynamic = 'force-static';
// Revalidate once per day to pick up any content updates
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Terms of Use - Uncubed',
  description: 'Read the terms and conditions for using Uncubed, the AI-powered startup co-pilot.',
  alternates: {
    canonical: 'https://uncubed.me/terms',
  },
};

export default function Terms() {
  return (
    <div className="min-h-screen py-20 px-6 bg-light-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
        <p className="text-sm mb-8 text-gray-600">
          Last updated: October 5, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            Welcome to Uncubed ("we," "our," "us"). By using Uncubed, you ("you," "your," or "User") agree to the following terms. Please read them carefully. If you do not agree, do not use Uncubed.
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
          <p className="mb-6">
            Uncubed is an AI-powered startup co-pilot that helps validate ideas, research markets, generate strategies, and provide guidance. We may update, add, or remove features at any time.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>You must be at least 16 years old to use Uncubed.</li>
            <li>By creating an account, you represent that you have the authority to do so and that all information provided is accurate.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. Accounts</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activity under your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Subscription & Payments</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Uncubed offers free and paid subscription plans.</li>
            <li>Payments are processed by Razorpay. We do not store full payment details.</li>
            <li>Subscriptions automatically renew unless canceled before the next billing cycle.</li>
            <li>Refunds are not guaranteed but may be granted at our discretion.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Use Uncubed for illegal, harmful, or fraudulent purposes.</li>
            <li>Attempt to reverse engineer, copy, or resell the service.</li>
            <li>Abuse the platform with automated scripts, scraping, or excessive requests.</li>
            <li>Input or share content that violates intellectual property or privacy rights.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">6. AI Output Disclaimer</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Uncubed provides AI-generated outputs (business plans, market analysis, financial estimates, etc.).</li>
            <li>These outputs are for informational purposes only and are not financial, legal, or professional advice.</li>
            <li>You are solely responsible for decisions made based on AI outputs.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property & Data Rights</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>All content, code, and designs of Uncubed are owned by us.</li>
            <li>You retain full ownership of your own project data, business ideas, and inputs.</li>
            <li>By using Uncubed, you grant us a limited license to process your inputs for the purpose of providing the service.</li>
            <li>You maintain control over your data and can request deletion at any time.</li>
            <li>We use anonymized data for product improvement, never sharing your personal information.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">8. Data Security & Privacy</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>We implement enterprise-grade security measures including Row Level Security (RLS) to protect your data.</li>
            <li>Your data is encrypted in transit and at rest using industry-standard encryption.</li>
            <li>You can only access your own projects and data - cross-user data access is prevented at the database level.</li>
            <li>All data access is logged and monitored for security purposes.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>You may stop using Uncubed at any time by deleting your account.</li>
            <li>We may suspend or terminate your account if you violate these Terms or misuse the service.</li>
            <li>Upon account deletion, your data will be permanently removed from our systems.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Uncubed is provided "as is" and "as available."</li>
            <li>We make no guarantees that the service will be error-free or uninterrupted.</li>
            <li>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
          <p className="mb-6">
            We may update these Terms occasionally. Continued use of Uncubed after updates means you accept the new Terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p className="mb-6">
            These Terms are governed by the laws of India, without regard to conflict of law principles.
          </p>

          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p className="mb-4">For questions about these Terms, contact:</p>
          <p className="mb-2"><strong>Uncubed</strong></p>
          <p>Email: contact@uncubed.me</p>
        </div>
      </div>
    </div>
  );
}
