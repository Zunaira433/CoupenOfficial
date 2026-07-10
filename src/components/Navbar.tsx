// import Link from "next/link";
// import { getCurrentUser } from "@/lib/auth";
// import DarkModeToggle from "@/components/DarkModeToggle";
// import LogoutButton from "@/components/LogoutButton";
// import { Tag, Search, BookOpen, Star, BarChart2, LayoutDashboard, Shield } from "lucide-react";

// export default function Navbar() {
//   const user = getCurrentUser();

//   return (
//     <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 gap-4">

//           {/* Logo */}
//           <Link
//             href="/"
//             className="flex items-center gap-2 text-xl font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
//             aria-label="CoupenOfficial home"
//           >
//             <Tag className="w-6 h-6" aria-hidden="true" />
//             <span>CoupenOfficial</span>
//           </Link>

//           {/* Primary nav */}
//           <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
//             {[
//               { href: "/categories", label: "Categories", icon: BarChart2 },
//               { href: "/deals", label: "Deals", icon: Tag },
//               { href: "/search", label: "Search", icon: Search },
//               { href: "/blog", label: "Blog", icon: BookOpen },
//               { href: "/compare", label: "Compare", icon: BarChart2 },
//               { href: "/review", label: "Reviews", icon: Star }
//             ].map(({ href, label, icon: Icon }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
//               >
//                 <Icon className="w-4 h-4" aria-hidden="true" />
//                 {label}
//               </Link>
//             ))}
//           </nav>

//           {/* Actions */}
//           <div className="flex items-center gap-2">
//             <DarkModeToggle />

//             {user ? (
//               <>
//                 {user.role === "ADMIN" && (
//                   <Link
//                     href="/admin"
//                     className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
//                   >
//                     <Shield className="w-4 h-4" aria-hidden="true" />
//                     Admin
//                   </Link>
//                 )}
//                 <Link
//                   href="/dashboard"
//                   className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
//                 >
//                   <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
//                   Dashboard
//                 </Link>
//                 <LogoutButton />
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
//                 >
//                   Log in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
//                 >
//                   Sign up
//                 </Link>
//               </>
//             )}
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }


export default function Navbar() {
  // const user = getCurrentUser();

  return (
    <header>
      Navbar Test
    </header>
  );
}