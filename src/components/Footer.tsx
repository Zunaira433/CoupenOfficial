import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { Tag, Facebook, Instagram, Linkedin } from "lucide-react";

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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18.9 1.5h3.7l-8 9.2 9.5 12.8h-7.4l-5.8-7.6-6.6 7.6H.6l8.6-9.9L0 1.5h7.6l5.2 7 6.1-7Zm-1.3 19.6h2L6.5 3.7H4.3l13.3 17.4Z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3ZM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2Zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.1 15 3.7 13.6 3.7 12c0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.3-8.3 8.3Z" />
    </svg>
  );
}
function QuoraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12.5 17.6c-.2 0-.4 0-.6-.1a5.7 5.7 0 0 1-5.4-5.8c0-3.2 2.6-5.8 5.9-5.8s5.9 2.6 5.9 5.8c0 2-1 3.7-2.6 4.8.5.6 1 .9 1.6.9.7 0 1.2-.3 1.6-.9l1 .7c-.7 1.1-1.7 1.7-3 1.7-1.2 0-2.3-.6-3.2-1.6-.4.2-.8.3-1.2.3Zm-2.6-5.9c0 2.2 1.2 3.7 2.7 4.1a3 3 0 0 1-.3-1.3c0-.4.2-.7.5-.7.6 0 1 1 1.2 2 1-.7 1.7-1.9 1.7-4.1 0-2.7-1.5-4.4-3.4-4.4s-3.4 1.7-3.4 4.4Z" />
    </svg>
  );
}
function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10Zm5.2 10.8c0 .5-.4 1-1 1a1 1 0 0 1-.7-.3c-1 .7-2.3 1.1-3.7 1.2l.6-2.9 2 .5v.1c0 .5.5 1 1 1s1-.5 1-1-.5-1-1-1c-.4 0-.7.2-.9.5l-2.3-.5-.5 2.3c-1.4-.1-2.7-.6-3.6-1.3a1 1 0 0 1-.7.3c-.6 0-1-.5-1-1s.4-1 1-1c.3 0 .6.1.8.4.9-.6 2.1-1 3.4-1.1l.6-2.9c0-.1.1-.2.3-.2l2 .5c.1-.4.5-.7 1-.7.6 0 1 .5 1 1.1s-.4 1-1 1-1-.5-1-1v-.1l-1.8-.4-.5 2.5c1.2.1 2.4.5 3.3 1.1.2-.2.5-.4.8-.4.6 0 1 .4 1 1Zm-6.7-.3c-.4 0-.7.3-.7.7 0 .4.3.7.7.7.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7Zm3.5 0c-.4 0-.7.3-.7.7 0 .4.3.7.7.7.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7Zm-1.7 3c-.6 0-1.2-.1-1.7-.3-.1 0-.2.1-.1.2.4.4 1.1.6 1.8.6s1.4-.2 1.8-.6c.1-.1 0-.2-.1-.2-.5.2-1.1.3-1.7.3Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/coupenofficial", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/coupenofficial", Icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/coupenofficial", Icon: Linkedin },
  { label: "X (Twitter)", href: "https://x.com/coupenofficial", Icon: XIcon },
  { label: "WhatsApp", href: "https://wa.me/1234567890", Icon: WhatsAppIcon },
  { label: "Quora", href: "https://quora.com/profile/coupenofficial", Icon: QuoraIcon },
  { label: "Reddit", href: "https://reddit.com/user/coupenofficial", Icon: RedditIcon }
];

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
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
              <Tag className="w-5 h-5 text-primary" aria-hidden="true" />
              CoupenOfficial
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
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