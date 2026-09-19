import {
  Instagram,
  FacebookIcon,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#061522] border-t border-[#1976C5]/20 pt-20 pb-8 overflow-hidden">

      {/* Background Effects */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(25,118,197,0.08),transparent_60%)]" />

        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />

      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}

          <div>

            <img
              src="/oxn-logo.png"
              alt="OXN"
              className="h-20 w-auto mb-6"
            />

            <p className="text-gray-400 leading-8 text-sm mb-8">

              Premium sports nutrition engineered for athletes who demand
              unmatched strength, explosive power and relentless performance.

            </p>

            <div className="flex gap-4">

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-[#1976C5]/20 flex items-center justify-center hover:bg-[#1976C5] hover:text-black transition-all duration-200"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl border border-[#1976C5]/20 flex items-center justify-center hover:bg-[#1976C5] hover:text-black transition-all duration-200"
              >
               <FacebookIcon size={18} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl border border-[#1976C5]/20 flex items-center justify-center hover:bg-[#1976C5] hover:text-black transition-all duration-200"
              >
                <Youtube size={18} />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-[#1976C5] text-lg font-bold uppercase tracking-wider mb-6">

              Quick Links

            </h3>

            <ul className="space-y-3">

              {[
                "Home",
                "Products",
                "About",
                "Distributor",
                "Contact",
              ].map((link) => (

                <li key={link}>

                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-[#1976C5] transition-colors duration-200"
                  >
                    {link}
                  </a>

                </li>

              ))}

            </ul>

          </div>

          {/* Categories */}

          <div>

            <h3 className="text-[#1976C5] text-lg font-bold uppercase tracking-wider mb-6">

              Categories

            </h3>

            <ul className="space-y-3">

              {[
                "Whey Protein",
                "Birthday Cake",
                "Cookies & Cream",
                "Chocolate Hazelnut",
                "Double Rich Chocolate",
                "Strawberry Cheesecake",
              ].map((item) => (

                <li key={item}>

                  <a
                    href="#products"
                    className="text-gray-400 hover:text-[#1976C5] transition-colors duration-200"
                  >
                    {item}
                  </a>

                </li>

              ))}

            </ul>

          </div>

            {/* Contact */}

                                   <div>

                                     <h3 className="text-[#1976C5] text-lg font-bold uppercase tracking-wider mb-6">

                                       Contact

                                     </h3>

                                     <ul className="space-y-5">

                                       <li className="flex items-start gap-4">

                                         <Mail
                                           size={18}
                                           className="text-[#1976C5] mt-1 flex-shrink-0"
                                         />

                                         <span className="text-gray-400">

                                           oxnsupplements@gmail.com

                                         </span>

                                       </li>

                                       <li className="flex items-start gap-4">

                                         <Phone
                                           size={18}
                                           className="text-[#1976C5] mt-1 flex-shrink-0"
                                         />

                                         <span className="text-gray-400">

                                           +91 8072081720

                                         </span>

                                       </li>

                                       <li className="flex items-start gap-4">

                                         <MapPin
                                           size={18}
                                           className="text-[#1976C5] mt-1 flex-shrink-0"
                                         />

                                         <span className="text-gray-400 leading-7">

                                           23 ,Jameela Complex Madhavaram
                                           High Road,Moolakadai, Chennai
                                           Tamil Nadu , 600060
                                           <br />
                                           India

                                         </span>

                                       </li>

                                     </ul>

                                   </div>

                                 </div>

                                 {/* Bottom Bar */}

                                 <div className="border-t border-[#1976C5]/20 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">

                                   <p className="text-gray-500 text-sm text-center lg:text-left">

                                     © {new Date().getFullYear()} OXN Nutrition.
                                     All Rights Reserved.

                                   </p>

                                   <div className="flex flex-wrap items-center justify-center gap-8">

                                     <a
                                       href="#"
                                       className="text-gray-500 hover:text-[#1976C5] transition-colors"
                                     >
                                       Privacy Policy
                                     </a>

                                     <a
                                       href="#"
                                       className="text-gray-500 hover:text-[#1976C5] transition-colors"
                                     >
                                       Terms & Conditions
                                     </a>

                                     <a
                                       href="#"
                                       className="text-gray-500 hover:text-[#1976C5] transition-colors"
                                     >
                                       Shipping Policy
                                     </a>

                                     <a
                                       href="#"
                                       className="text-gray-500 hover:text-[#1976C5] transition-colors"
                                     >
                                       Refund Policy
                                     </a>

                                   </div>

                                 </div>

                               </div>

                             </footer>
                           );
                         }