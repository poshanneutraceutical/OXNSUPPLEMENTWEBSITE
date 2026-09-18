import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Loader2,
  Trophy,
  Truck,
  Users,
  TrendingUp,
} from "lucide-react";
import { api, type DistributorInquiry } from "../lib/api";

export default function Distributor() {

  const [form, setForm] = useState<DistributorInquiry>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    city: "",
    state: "",
    message: "",
  });

  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!form.fullName || !form.email) return;

    setStatus("loading");

    try {

      await api.submitDistributor(form);

      setStatus("success");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        city: "",
        state: "",
        message: "",
      });

    } catch {

      setStatus("error");

    }

  };

  return (

    <section
      id="distributor"
      className="relative py-28 bg-[#0A1D2D] overflow-hidden"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,118,197,0.10),transparent_55%)]" />

        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Side */}

          <div
            data-reveal
              className= "reveal"
              >
            <span className="uppercase tracking-[0.45em] text-[#1976C5] text-sm font-semibold">

              Business Partnership
            </span>

            <h2 className="mt-6 text-5xl md:text-7xl font-black uppercase leading-none">

              Become an

              <span className="block text-[#1976C5]">

                OXN Distributor

              </span>

            </h2>

            <div className="w-32 h-[3px] bg-[#1976C5] rounded-full mt-8 mb-8" />

            <p className="text-gray-400 text-lg leading-8 max-w-xl">

              Join the OXN distribution network and grow with one of
              India's fastest-growing premium sports nutrition brands.

              Expand your business with trusted products, strong margins,
              nationwide support and premium branding.

            </p>

            <div className="grid grid-cols-2 gap-8 mt-14">

              {[
                {
                  icon: TrendingUp,
                  value: "40%",
                  label: "Retail Margin",
                },
                {
                  icon: Truck,
                  value: "24 Hrs",
                  label: "Fast Dispatch",
                },
                {
                  icon: Users,
                  value: "500+",
                  label: "Retail Partners",
                },
                {
                  icon: Trophy,
                  value: "Premium",
                  label: "Brand Value",
                },
             ].map((item, index) => {

                const Icon = item.icon;

                return (

                 <div
                   key={item.label}
                   data-reveal
                   data-delay={index * 100}
                   className="
                     reveal
                     rounded-2xl
                     border
                     border-[#1976C5]/20
                     bg-[#10283A]
                     p-6
                   "
                 >

                    <Icon
                      className="text-[#1976C5] mb-4"
                      size={30}
                    />

                    <h3 className="text-3xl font-black text-white">

                      {item.value}

                    </h3>

                    <p className="text-gray-400 mt-2">

                      {item.label}

                    </p>

                  </div>

                );

              })}

            </div>

          </div>
          {/* Right Side */}

          <div
           data-reveal
            data-delay={100}
          className="rounded-3xl border border-[#1976C5]/20 bg-[#10283A] p-8 md:p-10 shadow-[0_0_45px_rgba(25,118,197,0.08)]">

            {status === "success" ? (

              <div className="py-16 text-center animate-fadeIn">

                <CheckCircle2
                  size={70}
                  className="mx-auto text-[#1976C5] mb-8"
                />

                <h3 className="text-4xl font-black uppercase text-white mb-4">

                  Application Submitted

                </h3>

                <p className="text-gray-400 max-w-md mx-auto leading-8">

                  Thank you for your interest in becoming an OXN
                  Distributor.

                  Our business team will contact you shortly.

                </p>

                <button
                  onClick={() => setStatus("idle")}
                  className="mt-10 px-8 py-4 rounded-xl bg-[#1976C5] text-black font-bold uppercase tracking-wider hover:bg-[#2B86D0] transition-all"
                >

                  Submit Another

                </button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div>

                  <span className="uppercase tracking-[0.35em] text-[#1976C5] text-xs">

                    Distributor Form

                  </span>

                  <h3 className="text-4xl font-black text-white mt-3">

                    Let's Work Together

                  </h3>

                  <p className="text-gray-400 mt-3">

                    Complete the form below and our business team will
                    contact you.

                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    name="fullName"
                    placeholder="Full Name *"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="ghost-input"
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="ghost-input"
                  />

                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="ghost-input"
                  />

                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName}
                    onChange={handleChange}
                    className="ghost-input"
                  />

                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="ghost-input"
                  />

                  <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="ghost-input"
                  />

                </div>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your business..."
                  value={form.message}
                  onChange={handleChange}
                  className="ghost-input resize-none"
                />

                {status === "error" && (

                  <p className="text-red-500">

                    Something went wrong.

                    Please try again.

                  </p>

                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-xl bg-[#1976C5] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#2B86D0] transition-all disabled:opacity-60 flex justify-center items-center gap-3"
                >

                  {status === "loading" ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Application
                    </>
                  )}

                </button>

              </form>

            )}

          </div>
                  </div>

                </div>

              </section>

            );
          }