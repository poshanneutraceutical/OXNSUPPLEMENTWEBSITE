import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { FaWhatsapp } from "react-icons/fa";

import Cursor from "./components/Cursor";
import useReveal from "./hooks/useReveal";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Product from "./components/Product";
import Features from "./components/Features";
import About from "./components/About";
import Distributor from "./components/Distributor";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import OrderSuccess from "./pages/OrderSuccess";

/* =========================================================
   HOME PAGE
========================================================= */

function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden">
        <Hero />

        <Product />

        <Features />

        <About />

        <Distributor />

        <Contact />
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  useReveal();

  /* =======================================================
     LENIS SMOOTH SCROLL
  ======================================================= */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    let animationFrame: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    }

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="
        relative
        min-h-screen
        bg-black
        text-white
        overflow-hidden
      "
    >

      {/* Premium Cursor */}

      <Cursor />

      {/* Premium Background Glow */}

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.15),transparent_35%)]
        "
      />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />



        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ORDER SUCCESS */}

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

      </Routes>

      {/* =================================================
          WHATSAPP
      ================================================= */}

      <a
        href="https://wa.me/918072081720?text=Hello%20OXN%20Supplements%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with OXN Supplements on WhatsApp"
        title="Chat with OXN Supplements on WhatsApp"
        className="
          fixed
          bottom-6
          right-6
          z-50
          bg-[#25D366]
          hover:bg-[#1EBE5D]
          text-white
          p-4
          rounded-full
          shadow-2xl
          transition-all
          duration-300
          hover:scale-110
        "
      >
        <FaWhatsapp size={32} />
      </a>

    </div>
  );
}

export default App;