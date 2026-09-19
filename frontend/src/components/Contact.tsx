import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { api, type ContactMessage } from "../lib/api";

export default function Contact() {

  const [form, setForm] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!form.name || !form.email || !form.message) return;

    setStatus("loading");

    try {

      await api.submitContact(form);

      setStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch {

      setStatus("error");

    }

  };

  return (

    <section
      id="contact"
      className="relative py-28 bg-[#071824] overflow-hidden"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,118,197,0.12),transparent_45%)]" />

        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="uppercase tracking-[0.45em] text-[#1976C5] text-sm font-semibold">

            Contact OXN

          </span>

          <h2 className="mt-6 text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-none">

            <span className="text-white">
              Get In
            </span>{" "}

            <span className="text-[#1976C5]">
              Touch
            </span>

          </h2>

          <div className="w-32 h-[3px] bg-[#1976C5] mx-auto my-8 rounded-full" />

          <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-8">

            Have questions regarding our products,
            orders or distributorship?

            Our OXN support team is always
            ready to help you.

          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Side */}

          <div>

            <div className="space-y-8">

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-full bg-[#1976C5]/10 flex items-center justify-center">

                  <Mail
                    size={24}
                    className="text-[#1976C5]"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Email
                  </h3>

                  <p className="text-gray-400">
                    oxnsupplements@gmail.com
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-full bg-[#1976C5]/10 flex items-center justify-center">

                  <Phone
                    size={24}
                    className="text-[#1976C5]"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Phone
                  </h3>

                  <p className="text-gray-400">
                    +91 8072081720
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-full bg-[#1976C5]/10 flex items-center justify-center">

                  <MapPin
                    size={24}
                    className="text-[#1976C5]"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Office
                  </h3>

                  <p className="text-gray-400 leading-7">

                    23 ,Jameela Complex Madhavaram
                    High Road,Moolakadai, Chennai
                    Tamil Nadu , 600060

                  </p>

                </div>

              </div>

            </div>

            {/* Business Hours */}

            <div className="mt-12 rounded-3xl border border-[#1976C5]/20 bg-[#10283A] p-8">

              <h3 className="text-2xl font-bold text-white mb-6">

                Business Hours

              </h3>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Monday - Friday
                  </span>

                  <span className="text-white">
                    10:00 AM - 6:00 PM
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Saturday
                  </span>

                  <span className="text-[#1976C5]">
                    Closed
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Sunday
                  </span>

                  <span className="text-[#1976C5]">
                    Closed
                  </span>

                </div>

              </div>

            </div>

          </div>



                      {/* Contact Form */}
                      <div className="relative">

                        <div className="absolute inset-0 bg-gradient-to-br from-[#1976C5]/10 to-transparent rounded-3xl blur-2xl" />

                        <div className="relative bg-[#10283A] border border-[#1976C5]/20 rounded-3xl p-8 lg:p-10">

                          {status === "success" ? (

                            <div className="text-center py-14">

                              <CheckCircle2
                                size={70}
                                className="text-[#1976C5] mx-auto mb-6"
                              />

                              <h3 className="text-3xl font-black uppercase text-white mb-4">
                                Message Sent Successfully
                              </h3>

                              <p className="text-gray-400 mb-8">
                                Thank you for contacting OXN.
                                <br />
                                Our team will respond within 24 hours.
                              </p>

                              <button
                                onClick={() => setStatus("idle")}
                                className="btn-primary w-full justify-center"
                              >
                                Send Another Message
                              </button>

                            </div>

                          ) : (

                            <form
                              onSubmit={handleSubmit}
                              className="space-y-6"
                            >

                              <div className="grid md:grid-cols-2 gap-5">

                                <div>

                                  <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
                                    Full Name *
                                  </label>

                                  <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="ghost-input"
                                    placeholder="Enter your full name"
                                  />

                                </div>

                                <div>

                                  <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
                                    Email Address *
                                  </label>

                                  <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="ghost-input"
                                    placeholder="Enter your email"
                                  />

                                </div>

                              </div>

                              <div>

                                <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
                                  Subject
                                </label>

                                <input
                                  type="text"
                                  name="subject"
                                  value={form.subject}
                                  onChange={handleChange}
                                  className="ghost-input"
                                  placeholder="Subject"
                                />

                              </div>

                              <div>

                                <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
                                  Message *
                                </label>

                                <textarea
                                  name="message"
                                  value={form.message}
                                  onChange={handleChange}
                                  required
                                  rows={6}
                                  className="ghost-input resize-none"
                                  placeholder="Write your message..."
                                />

                              </div>

                              {status === "error" && (

                                <div className="text-red-500 text-sm">
                                  Something went wrong. Please try again.
                                </div>

                              )}

                             <button
                               type="submit"
                               disabled={status === "loading"}
                               className="btn-primary w-full flex items-center justify-center gap-3"
                             >
                               {status === "loading" ? (
                                 <>
                                   <Loader2
                                     size={18}
                                     className="animate-spin shrink-0"
                                   />
                                   <span>Sending...</span>
                                 </>
                               ) : (
                                 <>
                                   <Send
                                     size={18}
                                     className="shrink-0"
                                   />
                                   <span>Send Message</span>
                                 </>
                               )}
                             </button>

                            </form>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </section>

              );

            }