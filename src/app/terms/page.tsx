export const metadata = { title: "Terms of Service – CoupenOfficial" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <p>
          Welcome to CoupenOfficial. By accessing or using this website, you agree to be bound by
          the following terms and conditions. Please read them carefully.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            1. Use of the Site
          </h2>
          <p>
            CoupenOfficial provides coupon codes, deals, reviews, and comparisons for informational
            purposes. Coupons and deals are provided by third-party merchants and are subject to
            change or expiry without notice. We do our best to keep listings accurate and up to
            date, but we cannot guarantee that every code will work at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            2. Affiliate Relationships
          </h2>
          <p>
            CoupenOfficial participates in affiliate marketing programmes. When you click a coupon
            or deal link and make a purchase on a merchant&apos;s website, we may earn a commission
            at no extra cost to you. This does not affect the price you pay.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            3. User Accounts
          </h2>
          <p>
            When you create an account, you are responsible for maintaining the confidentiality of
            your login credentials and for all activity under your account. You agree to provide
            accurate information when registering.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            4. User Content
          </h2>
          <p>
            Reviews, comments, and other content you submit must not be false, misleading,
            defamatory, or otherwise unlawful. We reserve the right to moderate, edit, or remove
            any user-submitted content at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            5. Limitation of Liability
          </h2>
          <p>
            CoupenOfficial is not responsible for the products, services, or business practices of
            third-party merchants featured on this site. We make no warranties regarding the
            accuracy or reliability of external offers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            6. Changes to These Terms
          </h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of the site after
            changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            7. Contact
          </h2>
          <p>
            If you have questions about these Terms, please reach out through our contact page.
          </p>
        </section>
      </div>
    </div>
  );
}