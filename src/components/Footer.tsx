import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { Tag } from "lucide-react";

const footerLinks = {
  "Browse": [
    { label: "All Deals", href: "/deals" },
    { label: "Categories", href: "/categories" },
    { label: "All Brands", href: "/brand" },
    { label: "Search", href: "/search" }
  ],
  "Content": [
    { label: "Blog", href: "/blog" },
    { label: "Reviews", href: "/review" },
    { label: "Comparisons", href: "/compare" }
  ],
  "Account": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" }
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Sitemap", href: "/sitemap.xml" }
  ]
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Newsletter */}
        <div className="mb-16">
          <NewsletterForm />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section}
              </h3>
              <ul className="space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
            <Tag className="w-5 h-5 text-primary" aria-hidden="true" />
            CoupenOfficial
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            <strong>Affiliate Disclosure:</strong> CoupenOfficial participates in affiliate marketing programmes.
            When you click a coupon link and make a purchase, we may earn a commission at no extra cost to you.
            This helps us keep the site free and our coupon database up to date.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {year} CoupenOfficial. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
