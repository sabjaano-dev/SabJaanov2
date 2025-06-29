// // Navbar.tsx
// "use client";

// import { useState } from "react";
// import { Menu, X, Search, ShoppingBag, ChevronDown } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="flex items-center justify-between px-6 py-6 text-white text-sm font-semibold bg-transparent z-50 relative">
//       <div className="flex items-center gap-12">
//         <h1 className="text-2xl font-bold tracking-tight text-black">SabJaano</h1>
//         <nav className="hidden md:flex gap-14 font-semibold text-black text-base">
//           {[
//             { label: 'Products', menu: ['Ad Formats', 'Analytics', 'Billing'] },
//             {
//               label: 'Solutions',
//               mega: true,
//               content: [
//                 {
//                   title: 'By Stage',
//                   items: ['Enterprises', 'Startups'],
//                 },
//                 {
//                   title: 'By Industry',
//                   items: ['E-commerce', 'Retail', 'SaaS', 'Platforms'],
//                 },
//                 {
//                   title: 'By Use Case',
//                   items: ['Fintech', 'Real Estate', 'Events', 'D2C'],
//                 },
//               ],
//             },
//             { label: 'Developers', menu: ['API Docs', 'Webhooks', 'SDKs'] },
//             { label: 'Resources', menu: ['Blog', 'Guides', 'Help Center'] },
//             { label: 'Pricing', menu: ['Plans', 'FAQs'] },
//           ].map(({ label, menu, mega, content }, idx) => (
//             <div
//               key={idx}
//               className="relative group"
//               onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
//             >
//               <div className="flex items-center gap-1 cursor-pointer group-hover:text-black/70">
//                 <span>{label}</span>
//                 <ChevronDown className="w-5 h-5 transition-transform duration-300 transform group-hover:rotate-180" />
//               </div>

//               {/* Regular Dropdown */}
//               {!mega && menu && (
//                 <div className="absolute left-0 mt-3 w-44 bg-white text-black rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-300 origin-top z-50">
//                   <ul className="p-2 space-y-1 text-sm font-medium">
//                     {menu.map((item, i) => (
//                       <li key={i} className="hover:bg-gray-100 px-3 py-1 rounded">
//                         <a href="#">{item}</a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Mega Menu */}
//               {mega && content && (
//                 <div className="absolute left-0 mt-6 w-[700px] bg-white text-black rounded-xl shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-300 origin-top z-50 p-6 grid grid-cols-3 gap-6">
//                   {content.map((section, sIdx) => (
//                     <div key={sIdx}>
//                       <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
//                         {section.title}
//                       </h4>
//                       <ul className="space-y-2 text-sm font-medium">
//                         {section.items.map((item, iIdx) => (
//                           <li key={iIdx} className="hover:bg-gray-100 rounded px-2 py-1">
//                             <a href="#">{item}</a>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Right nav */}
//       <div className="flex items-center gap-4">
//         <a href="#" className="hover:underline text-black">
//           Sign in
//         </a>
//         <button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-semibold flex items-center gap-2">
//           Contact sales <ChevronDown className="w-4 h-4" />
//         </button>
//         <Search className="h-4 w-4 text-black" />
//         <ShoppingBag className="h-5 w-5 text-black" />
//         <Menu className="h-5 w-5 md:hidden text-black" />
//       </div>
//     </header>
//   );
// }
