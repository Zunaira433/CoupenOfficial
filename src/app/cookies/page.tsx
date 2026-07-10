import { Cookie } from "lucide-react";

export const metadata = { title: "Cookie Policy – CoupenOfficial" };

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-3 mb-8">
        <Cookie className="w-8 h-8 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <p>
          This page explains what cookies CoupenOfficial uses, why we use them, and the choices
          you have.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            What are cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They
            help websites remember information about your visit, such as your preferences or
            whether you have logged in.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Cookies we use
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential cookies</strong> — used to keep you logged in and secure (for
              example, your session cookie after logging in). These cannot be disabled, as the
              site cannot function without them.
            </li>
            <li>
              <strong>Analytics cookies (Google Analytics)</strong> — used to understand how
              visitors use the site, such as which pages are most popular. These are only set if
              you click &quot;Accept&quot; on the cookie banner.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Your choices
          </h2>
          <p>
            When you first visit CoupenOfficial, you can choose to accept or reject analytics
            cookies via the cookie banner. Rejecting analytics cookies does not affect your
            ability to browse coupons, create an account, or use any other feature of the site.
          </p>
          <p>
            You can also clear cookies at any time through your browser&apos;s settings, which
            will reset your previous choice and show the banner again on your next visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            Contact
          </h2>
          <p>
            If you have questions about this Cookie Policy, please reach out through our contact
            page.
          </p>
        </section>
      </div>
    </div>
  );
}