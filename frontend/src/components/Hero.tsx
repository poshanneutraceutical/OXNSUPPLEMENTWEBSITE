import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Award,
} from "lucide-react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -70,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 70,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#061522]"
    >
      {/* ========================= */}
      {/* Premium Background */}
      {/* ========================= */}

      <div className="absolute inset-0">
        {/* Background Image */}

        <img
          src="/oxn-logo.png"
          alt="OXN premium sports nutrition athlete"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/75" />

        {/* Gold Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

        {/* Gold Glow */}

        <div className="absolute -left-40 top-20 h-[650px] w-[650px] rounded-full bg-[#1976C5]/10 blur-[170px]" />

        <div className="absolute right-0 bottom-0 h-[550px] w-[550px] rounded-full bg-[#1976C5]/10 blur-[170px]" />

        {/* Noise */}

        <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />
      </div>

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          opacity-10
          bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)]
          bg-[size:80px_80px]
        "
      />

      {/* ========================= */}
      {/* Main Content */}
      {/* ========================= */}

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-36 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ========================= */}
          {/* LEFT CONTENT */}
          {/* ========================= */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Label */}

            <motion.div
              custom={0}
              variants={fadeLeft}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-16 h-[2px] bg-[#1976C5]" />

              <span className="uppercase tracking-[0.45em] text-[#1976C5] text-sm font-semibold">
                PREMIUM WHEY PROTEIN
              </span>
            </motion.div>

            {/* Main Heading */}

            <motion.h1
              custom={0.15}
              variants={fadeUp}
              className="
                text-6xl
                md:text-7xl
                xl:text-8xl
                font-black
                uppercase
                leading-[0.9]
              "
            >
              <span className="text-white">
                ELEVATE
              </span>

              <br />

              <span className="text-[#1976C5]">
                YOUR STANDARD
              </span>
            </motion.h1>

            {/* Description */}

            <motion.p
              custom={0.25}
              variants={fadeUp}
              className="mt-8 max-w-xl text-lg leading-9 text-gray-300"
            >
              OXN Supplement brings a premium whey protein experience built
              around bold flavour, clean presentation and a modern
              performance-focused identity. Explore the OXN collection
              and discover a new standard for your daily nutrition routine.
            </motion.p>

            {/* CTA Buttons */}

            <motion.div
              custom={0.35}
              variants={fadeUp}
              className="flex flex-wrap gap-5 mt-12"
            >
              <a
                href="#arsenal"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-[#1976C5]
                  px-8
                  py-4
                  font-bold
                  uppercase
                  tracking-widest
                  text-black
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-[0_0_40px_rgba(25,118,197,.35)]
                "
              >
                Explore Products

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href="#story"
                className="
                  inline-flex
                  items-center
                  rounded-xl
                  border
                  border-[#1976C5]/30
                  px-8
                  py-4
                  font-semibold
                  uppercase
                  tracking-widest
                  text-white
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-[#1976C5]
                  hover:bg-[#1976C5]/10
                "
              >
                Learn More
              </a>
            </motion.div>

            {/* ========================= */}
            {/* Premium Feature Cards */}
            {/* ========================= */}

            <motion.div
              custom={0.45}
              variants={fadeUp}
              className="grid sm:grid-cols-2 gap-6 mt-14"
            >
              {/* Certified Quality */}

              <div
                className="
                  rounded-3xl
                  border
                  border-[#1976C5]/20
                  bg-white/[0.04]
                  backdrop-blur-xl
                  p-6
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#1976C5]
                    flex
                    items-center
                    justify-center
                    text-black
                    mb-5
                  "
                >
                  <ShieldCheck size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Certified Quality
                </h3>

                <p className="text-gray-400 leading-7">
                  Every batch undergoes strict laboratory testing
                  to ensure purity, safety and premium performance.
                </p>
              </div>

              {/* Maximum Performance */}

              <div
                className="
                  rounded-3xl
                  border
                  border-[#1976C5]/20
                  bg-white/[0.04]
                  backdrop-blur-xl
                  p-6
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#1976C5]
                    flex
                    items-center
                    justify-center
                    text-black
                    mb-5
                  "
                >
                  <Zap size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Maximum Performance
                </h3>

                <p className="text-gray-400 leading-7">
                  Engineered for explosive strength,
                  endurance, recovery and elite athletic
                  performance.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================= */}
          {/* RIGHT CONTENT */}
          {/* ========================= */}

          <motion.div
            custom={0.2}
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="
              relative
              flex
              justify-center
              items-center
              min-h-[480px]
              sm:min-h-[560px]
              lg:min-h-[760px]
              mt-12
              lg:mt-0
            "
          >
            {/* Premium Gold Glow */}

            <div
              className="
                absolute
                w-[350px]
                h-[350px]
                sm:w-[500px]
                sm:h-[500px]
                lg:w-[650px]
                lg:h-[650px]
                rounded-full
                bg-[#1976C5]/15
                blur-[120px]
                lg:blur-[170px]
              "
            />

            {/* Floating Background Ring */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                absolute
                w-[320px]
                h-[320px]
                sm:w-[450px]
                sm:h-[450px]
                lg:w-[560px]
                lg:h-[560px]
                rounded-full
                border
                border-[#1976C5]/10
              "
            />

            {/* ========================= */}
            {/* Main Athlete */}
            {/* ========================= */}

            <motion.img
              src="/OXNHERO.png"
              alt="OXN Athlete"
              custom={0.3}
              variants={fadeRight}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="
                relative
                z-10
                w-auto
                h-[420px]
                sm:h-[500px]
                lg:h-[760px]
                max-w-full
                object-contain
                drop-shadow-[0_25px_55px_rgba(25,118,197,.28)]
                lg:drop-shadow-[0_35px_90px_rgba(25,118,197,.30)]
                rounded-[2rem]
                bg-white
                p-3
                sm:p-5
                lg:p-6
              "
            />
          </motion.div>
        </div>

        {/* ========================= */}
        {/* Premium Statistics */}
        {/* ========================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.05,
          }}
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-6
            mt-24
          "
        >
          {[
            {
              number: "25+",
              label: "Premium Products",
            },
            {
              number: "100%",
              label: "Quality Tested",
            },
            {
              number: "50K+",
              label: "Happy Customers",
            },
            {
              number: "24/7",
              label: "Customer Support",
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.05,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[#1976C5]/20
                bg-[#10283A]/70
                backdrop-blur-xl
                p-8
                text-center
                group
              "
            >
              {/* Hover Glow */}

              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  bg-[radial-gradient(circle_at_center,rgba(25,118,197,.12),transparent_70%)]
                "
              />

              <h2
                className="
                  relative
                  text-5xl
                  font-black
                  text-[#1976C5]
                "
              >
                {item.number}
              </h2>

              <p
                className="
                  relative
                  mt-3
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  text-gray-400
                "
              >
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ========================= */}
      {/* Bottom Fade */}
      {/* ========================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-40
          bg-gradient-to-t
          from-[#0B1B2A]
          via-[#0B1B2A]/70
          to-transparent
          z-20
        "
      />

      {/* ========================= */}
      {/* Scroll Indicator */}
      {/* ========================= */}

      <motion.a
        href="#arsenal"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [0, 8, 0],
        }}
        transition={{
          delay: 0.8,
          duration: 2,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          z-30
          flex
          flex-col
          items-center
          gap-2
          text-white/70
          hover:text-[#1976C5]
          transition-colors
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            font-semibold
          "
        >
          Scroll
        </span>

        <ChevronDown
          size={22}
          className="text-[#1976C5]"
        />
      </motion.a>
    </section>
  );
}