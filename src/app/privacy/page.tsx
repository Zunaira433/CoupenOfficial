export const metadata = { title: "Privacy Policy – CoupenOfficial" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <p>
          This Privacy Policy explains how CoupenOfficial collects, uses, and protects your
          information when you use our website.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account information</strong> — your name and email address when you register.</li>
            <li><strong>Usage data</strong> — pages visited, coupons clicked, and general site activity, used to improve our service.</li>
            <li><strong>Newsletter subscriptions</strong> — your email address, if you choose to subscribe.</li>
            <li><strong>Analytics</strong> — anonymous usage statistics via Google Analytics, only if you accept our cookie banner.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            How We Use Your Information
          </h2>
          <p>
            We use collected information to operate and improve the site, provide account features
            such as saved favourites and comments, send newsletter updates (if subscribed), and
            understand which content and deals are most useful to visitors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            How We Protect Your Information
          </h2>
          <p>
            Passwords are stored using industry-standard hashing and are never saved as plain text.
            We use secure, HTTP-only cookies for authentication and take reasonable technical
            measures to protect your data from unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Third Parties
          </h2>
          <p>
            We may share limited data with third-party services we use to operate the site, such as
            analytics providers, and with merchants when you click through an affiliate link (in the
            form of a standard referral, not personal information). We do not sell your personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Your Choices
          </h2>
          <p>
            You can control analytics cookies via our cookie banner at any time, update or delete
            your account information, and unsubscribe from the newsletter using the link in any
            email we send.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of the site after
            changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, please reach out through our contact
            page.
          </p>
        </section>
      </div>
    </div>
  );
}