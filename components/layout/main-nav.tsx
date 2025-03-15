"use client"; // Needed if we do any interactive toggling in here

import Link from "next/link";

// interface MainNavProps {
//   isOpen: boolean; // Whether the mobile nav is visible
//   closeNav: () => void; // Function to close the mobile nav
// }

// export function MainNav({ isOpen, closeNav }: MainNavProps) {
//   const routes = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About Us" },
//     { href: "/events", label: "Events" },
//     { href: "/posts", label: "Posts" },
//     { href: "/donate", label: "Donate" },
//     { href: "/contact", label: "Contact" },
//   ];

//   return (
//     <nav className="md:flex items-center space-x-6 hidden">
//       {routes.map((route) => (
//         <Link
//           key={route.href}
//           href={route.href}
//           className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
//         >
//           {route.label}
//         </Link>
//       ))}
//     </nav>
//   );
// }

// Extended version of MainNav (optional approach)
export function MainNav({ isOpen }: { isOpen: boolean }) {
  const routes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/posts", label: "Posts" },
    { href: "/donate", label: "Donate" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="text-sm font-medium text-gray-700 hover:text-emerald-600"
          >
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Nav (slide down or overlay) */}
      {isOpen && (
        <nav className="flex flex-col md:hidden mt-4 space-y-2 bg-white p-4 shadow">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-gray-700 font-medium hover:text-emerald-600"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
