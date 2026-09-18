import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import CartIcon from "../components/CartIcon";
import Magnetic from "./Magnetic";

const links = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#story" },
  { label: "Distributors", href: "#distributor" },
  { label: "Contact", href: "#contact" },
];


export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);


  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 40);

    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };


  }, []);



  return (

    <header

      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300

        ${
          scrolled
            ?
            "bg-black/85 backdrop-blur-2xl border-b border-yellow-500/20 shadow-lg shadow-yellow-500/10 py-3"
            :
            "bg-transparent py-5"
        }

      `}

    >



      <nav

        className="
          max-w-7xl
          mx-auto
          px-6
          flex
          items-center
          justify-between
        "

      >



        {/* ================= LOGO ================= */}


        <Magnetic>
          <a
            href="#home"
            className="
              flex
              items-center
              group
            "
          >


          <img

            src="/oxn-logo.png"

            alt="OXN"

            className="
              h-14
              md:h-16
              w-auto
              object-contain
              transition
              duration-300
              group-hover:scale-105
            "

          />


        </a>


      </Magnetic>


        {/* ================= DESKTOP MENU ================= */}



        <ul

          className="
            hidden
            lg:flex
            items-center
            gap-12
          "

        >


          {
            links.map((link) => (

              <li

                key={link.href}

              >


                <a

                  href={link.href}

                  className="
                    nav-link
                    text-sm
                    uppercase
                    tracking-[0.2em]
                  "

                >

                  {link.label}


                </a>


              </li>


            ))
          }


        </ul>







        {/* ================= DESKTOP ACTIONS ================= */}



        <div

          className="
            hidden
            lg:flex
            items-center
            gap-6
          "

        >



          <Magnetic strength={0.22}>
            <Link
              to="/verify-product"
              className="
                text-sm
                uppercase
                tracking-widest
                text-gray-300
                hover:text-yellow-400
                transition
              "
            >

            Verify Product


          </Link>


        </Magnetic>

          <CartIcon />






          <Magnetic strength={0.28}>
            <button
              className="
                btn-primary
                px-7
                py-3
                shimmer-btn
              "
            >


            <ShoppingBag size={18} />


            Shop Now



          </button>

</Magnetic>

        </div>







        {/* ================= MOBILE BUTTON ================= */}



        <button

          className="
            lg:hidden
            text-white
          "

          onClick={() => setOpen(!open)}

        >


          {

            open

            ?

            <X size={30}/>

            :

            <Menu size={30}/>

          }



        </button>




      </nav>








      {/* ================= MOBILE MENU ================= */}



      {

        open && (



          <div

            className="
              lg:hidden
              bg-black/95
              backdrop-blur-2xl
              border-t
              border-yellow-500/20
              animate-slideDown
            "

          >




            <ul

              className="
                flex
                flex-col
                px-6
                py-8
                gap-3
              "

            >





              {

                links.map((link)=>(


                  <li

                    key={link.href}

                  >


                    <a

                      href={link.href}

                      onClick={() => setOpen(false)}

                      className="
                        block
                        py-3
                        uppercase
                        tracking-widest
                        text-gray-300
                        hover:text-yellow-400
                        transition
                      "

                    >

                      {link.label}


                    </a>



                  </li>


                ))


              }







              <li>


                <Link

                  to="/verify-product"

                  onClick={() => setOpen(false)}

                  className="
                    block
                    py-3
                    uppercase
                    tracking-widest
                    text-gray-300
                    hover:text-yellow-400
                  "

                >

                  Verify Product


                </Link>


              </li>







              <li

                className="
                  flex
                  justify-center
                  py-4
                "

              >


                <CartIcon />


              </li>







              <li>


                <button

                  className="
                    btn-primary
                    w-full
                    justify-center
                  "

                >


                  <ShoppingBag size={18}/>


                  Shop Now



                </button>



              </li>






            </ul>





          </div>



        )

      }



    </header>


  );

}