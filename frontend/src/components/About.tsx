import { CheckCircle2, Award, FlaskConical, Users } from "lucide-react";
import { motion } from "framer-motion";

const points = [
  "Premium ingredients sourced from trusted global suppliers.",
  "Scientifically formulated for muscle growth and strength.",
  "Manufactured in GMP & ISO Certified facilities.",
  "Every batch tested for purity, safety and performance.",
];

const stats = [
  {
    icon: Users,
    value: "50K+",
    title: "Customers",
  },
  {
    icon: FlaskConical,
    value: "100%",
    title: "Lab Tested",
  },
  {
    icon: Award,
    value: "GMP",
    title: "Certified",
  },
];


export default function About() {

  return (

    <section
      id="story"
       data-reveal
      className="relative py-28 bg-[#071824] overflow-hidden"
    >

      {/* Background Effects */}

      <div className="absolute inset-0">

        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_left,rgba(25,118,197,0.15),transparent_45%)]
          "
        />

        <div
          className="
          absolute inset-0
          opacity-5
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),
          linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:70px_70px]
          "
        />

      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-6">


        <div className="grid lg:grid-cols-2 gap-20 items-center">


          {/* IMAGE SECTION */}

          <motion.div
            initial={{opacity:0,x:-50}}
            whileInView={{opacity:1,x:0}}
            transition={{duration:0.6}}
             viewport={{ once: false, amount: 0.2 }}
            className="relative"
          >


            <div
              className="
              overflow-hidden
              rounded-3xl
              border border-[#1976C5]/20
              "
            >

              <img

                src="/OXN2.png"

                alt="OXN Athlete"

                className="
                w-full
                h-[850px]
                object-cover
                transition duration-300
                hover:scale-105
                "

              />


              <div
                className="
                absolute inset-0
                bg-gradient-to-t
                from-black
                via-transparent
                to-transparent
                "
              />


            </div>


          </motion.div>
                    {/* CONTENT SECTION */}

                    <motion.div
                      initial={{opacity:0,x:50}}
                      whileInView={{opacity:1,x:0}}
                      transition={{duration:0.6}}
                      className="space-y-8"
                    >


                      <div>

                        <span
                         data-reveal
                          data-delay="50"
                          className="
                          text-[#1976C5]
                          uppercase
                          tracking-[0.3em]
                          text-sm
                          font-semibold
                          "
                        >
                          About OXN
                        </span>


                        <h2
                          data-reveal
                          data-delay="100"
                          className="
                          mt-4
                          text-5xl
                          lg:text-6xl
                          font-black
                          text-white
                          leading-tight
                          "
                        >

                          Built for
                          <span className="text-[#1976C5]">
                            {" "}Strength.
                          </span>

                          <br />

                          Designed for Performance.

                        </h2>



                        <p
                          data-reveal
                          data-delay="150"
                          className="
                          mt-6
                          text-gray-400
                          leading-8
                          text-lg
                          "
                        >

                          OXN delivers premium sports nutrition products
                          engineered for athletes, fitness enthusiasts, and
                          performance-driven individuals.

                          Every formula is developed using advanced research,
                          quality ingredients, and strict manufacturing standards.

                        </p>


                      </div>



                      {/* QUALITY POINTS */}


                      <ul
                        data-reveal
                        data-delay="200"
                      className="space-y-4">


                        {
                          points.map((point)=>(

                            <li
                              key={point}
                              className="
                              flex
                              items-start
                              gap-4
                              bg-[#10283A]
                              border
                              border-[#1976C5]/15
                              rounded-xl
                              p-4
                              hover:border-[#1976C5]/50
                              transition-all
                              duration-200
                              "
                            >


                              <div
                                className="
                                w-10
                                h-10
                                rounded-full
                                bg-[#1976C5]/10
                                flex
                                items-center
                                justify-center
                                flex-shrink-0
                                "
                              >

                                <CheckCircle2
                                  size={20}
                                  className="text-[#1976C5]"
                                />

                              </div>



                              <span
                                className="
                                text-gray-300
                                leading-7
                                "
                              >
                                {point}
                              </span>


                            </li>


                          ))
                        }


                      </ul>





                      {/* STATS */}


                      <div
                        data-reveal
                        data-delay="250"
                        className="
                        grid
                        grid-cols-3
                        gap-4
                        "
                      >


                        {
                          stats.map((item)=>{


                            const Icon=item.icon;


                            return (

                              <div
                                key={item.title}
                                className="
                                bg-[#10283A]
                                border
                                border-[#1976C5]/20
                                rounded-xl
                                p-5
                                text-center
                                hover:-translate-y-2
                                transition-all
                                duration-250
                                "
                              >


                                <Icon
                                  size={25}
                                  className="
                                  mx-auto
                                  mb-3
                                  text-[#1976C5]
                                  "
                                />


                                <h3
                                  className="
                                  text-3xl
                                  font-black
                                  text-[#1976C5]
                                  "
                                >

                                  {item.value}

                                </h3>



                                <p
                                  className="
                                  text-xs
                                  uppercase
                                  tracking-[0.25em]
                                  text-gray-500
                                  mt-2
                                  "
                                >

                                  {item.title}

                                </p>


                              </div>


                            )

                          })
                        }


                      </div>





                      {/* CTA BUTTON */}


                      <a

                        href="#distribute"
                          data-reveal
                          data-delay="300"
                        className="
                        inline-flex
                        items-center
                        gap-3
                        px-8
                        py-4
                        rounded-full
                        bg-[#1976C5]
                        text-black
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        hover:bg-[#2B86D0]
                        transition-all
                        duration-300
                        shadow-[0_0_35px_rgba(25,118,197,0.25)]
                        "

                      >

                        Become a Distributor

                      </a>



                    </motion.div>



                  </div>


                </div>


              </section>


            );


          }