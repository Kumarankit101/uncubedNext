import type { Metadata } from 'next';

// Force static generation - content rarely changes
export const dynamic = 'force-static';
// Revalidate once per day to pick up any content updates
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Privacy Policy - Uncubed',
  description: 'Learn how Uncubed collects, uses, and protects your personal information.',
  alternates: {
    canonical: 'https://uncubed.me/privacy',
  },
};

export default function Privacy() {
  return (
    <div className="min-h-screen py-20 px-6 bg-light-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm mb-8 text-gray-600">
          Last updated: October 5, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            At Uncubed ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. By using Uncubed, you agree to the practices described here.
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect the following types of information when you use Uncubed:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>Project Data:</strong> Business ideas, answers to refinement questions, generated outputs, and interactions with the AI advisor.</li>
            <li><strong>Payment Information:</strong> If you subscribe, payments are processed securely by Razorpay. We do not store your full payment details.</li>
            <li><strong>Usage Data:</strong> Logs of how you use Uncubed, including pages visited, features used, and device/browser type.</li>
            <li><strong>Cookies and Analytics:</strong> We may use cookies and third-party analytics (e.g., Google Analytics, Vercel, Sentry) to understand usage and improve the service.</li>
            <li><strong>Feedback:</strong> Any feedback you provide to help improve Uncubed.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide and improve the Uncubed platform.</li>
            <li>Personalize your experience, including AI outputs and advisor interactions.</li>
            <li>Handle payments and account management.</li>
            <li>Monitor system stability, prevent fraud, and ensure security.</li>
            <li>Communicate with you (service updates, feature announcements, feedback requests, and marketing emails if you opt in).</li>
            <li>Analyze product quality and improve AI responses (with your consent).</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
          <p className="mb-4">We do not sell your data. We may share limited information with:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Service Providers:</strong> e.g., Supabase (database/auth, hosted in India), OpenAI & Anthropic (AI APIs), Razorpay (payments), Azure (hosting).</li>
            <li><strong>Legal Obligations:</strong> If required by law or to protect our rights and users.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Data Retention & Encryption</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>We keep your account and project data for as long as your account is active.</li>
            <li><strong>Data Encryption:</strong> Your business ideas are encrypted after 30 days to protect your privacy while allowing us to improve our AI quality.</li>
            <li><strong>Anonymized Analytics:</strong> We use anonymized data (no personal information) for long-term product improvement and trend analysis.</li>
            <li>You may request deletion of your account and data at any time by contacting us.</li>
            <li>We may retain limited usage logs for security and troubleshooting.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">Depending on where you live, you may have rights to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access and download your data.</li>
            <li>Request corrections or deletion.</li>
            <li>Opt out of non-essential communications.</li>
          </ul>
          <p className="mb-6">To exercise these rights, email us at support@uncubed.me</p>

          <h2 className="text-2xl font-semibold mb-4">6. Security & Data Protection</h2>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Row Level Security (RLS):</strong> Your data is protected at the database level - you can only access your own projects, conversations, and data.</li>
            <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard encryption.</li>
            <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access your data.</li>
            <li><strong>Audit Logging:</strong> All data access is logged for security monitoring.</li>
          </ul>
          <p className="mb-6">However, no system is 100% secure.</p>

          <h2 className="text-2xl font-semibold mb-4">7. Data Analysis Consent</h2>
          <p className="mb-4">To improve our AI and provide better service, we may analyze your project data. You can control this through:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Opt-in Consent:</strong> You can choose to allow detailed analysis of your ideas to help improve Uncubed.</li>
            <li><strong>Default Protection:</strong> By default, your ideas are protected and only used for your own AI interactions.</li>
            <li><strong>Anonymized Analytics:</strong> We use anonymized data (no personal information) for product improvement.</li>
            <li><strong>Time-based Protection:</strong> Your ideas are automatically encrypted after 30 days for additional privacy.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="mb-6">Uncubed is not intended for children under 16. We do not knowingly collect personal information from minors.</p>

          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="mb-6">We may update this Privacy Policy as our service evolves. We will notify users by email or in-app when significant changes occur.</p>

          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">For questions about this Privacy Policy, contact:</p>
          <p className="mb-2"><strong>Uncubed</strong></p>
          <p>Email: contact@uncubed.me</p>
        </div>
      </div>
    </div>
  );
}
