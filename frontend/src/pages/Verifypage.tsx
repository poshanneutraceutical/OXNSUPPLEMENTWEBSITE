import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Hash,
} from "lucide-react";


  const API_URL = import.meta.env.VITE_API_URL || "/api";

interface VerifyResponse {
  status: "valid" | "invalid";
  message: string;
}

export default function VerifyPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "valid" | "invalid"
  >("idle");

  const [message, setMessage] = useState("");

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    if (value.length <= 9) {
      setCode(value);
    }
  };

  const resetResult = () => {
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (code.length !== 9) {
      alert("Scratch code must contain exactly 9 characters.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        `${API_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const data: VerifyResponse =
        await response.json();

      if (data.status === "valid") {
        setStatus("valid");
      } else {
        setStatus("invalid");
      }

      setMessage(data.message);
    } catch (error) {
      console.error(error);

      setStatus("invalid");

      setMessage(
        "Unable to verify the product. Please try again later."
      );
    }
  };

  const inputClass =
    "w-full bg-[#0E2435] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/30";

  const labelClass =
    "block text-xs uppercase tracking-[0.25em] text-white/60 mb-2";

  return (
    <div
      className="min-h-screen w-full bg-black text-white flex items-center justify-center px-5 py-12"
      style={{
        backgroundImage: "none",
        backgroundColor: "#000000",
      }}
    >
      <div className="w-full max-w-lg">

        <div className="bg-[#10283A] border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/products/oxn/double-rich-chocolate.png"
              alt="OXN"
              className="w-28 h-28 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-10">

            <div className="flex justify-center mb-5">
              <ShieldCheck
                size={52}
                className="text-[#FF6A00]"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Verify Product
            </h1>

            <p className="text-white/60 leading-relaxed">
              Enter your details along with the unique
              OXN verification code to confirm
              the authenticity of your product.
            </p>

          </div>

          {/* Form */}
          {status !== "valid" && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Name */}
              <div>
                <label className={labelClass}>
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-12`}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                    className={`${inputClass} pl-12`}
                    required
                  />
                </div>
              </div>

              {/* Scratch Code */}
              <div>
                <label className={labelClass}>
                  Scratch Code
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  <input
                    type="text"
                    value={code}
                    maxLength={9}
                    onChange={handleCodeChange}
                    placeholder="ABC123XYZ"
                    className={`${inputClass} pl-12 tracking-[0.35em] uppercase font-bold`}
                    required
                  />
                </div>

                <p className="text-white/35 text-xs mt-2">
                  Enter the 9-character code printed
                  beneath the scratch label.
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={
                  status === "loading" ||
                  code.length !== 9
                }
                className="w-full bg-[#FF6A00] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl py-4 flex items-center justify-center gap-3 text-white font-semibold text-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Verify Product
                  </>
                )}
              </button>

            </form>
          )}

          {/* Result */}
          {(status === "valid" ||
            status === "invalid") && (
            <div className="mt-8">

              <div
                className={`rounded-2xl border p-6 text-center ${
                  status === "valid"
                    ? "bg-green-600/10 border-green-500/40"
                    : "bg-red-600/10 border-red-500/40"
                }`}
              >

                {status === "valid" ? (
                  <CheckCircle2
                    size={70}
                    className="mx-auto text-green-500 mb-5"
                  />
                ) : (
                  <XCircle
                    size={70}
                    className="mx-auto text-red-500 mb-5"
                  />
                )}

                <h2
                  className={`text-3xl font-bold mb-4 ${
                    status === "valid"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {status === "valid"
                    ? "Product Verified"
                    : "Verification Failed"}
                </h2>

                <p className="text-white/75 leading-relaxed">
                  {message}
                </p>

                {status === "valid" && (
                  <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <p className="text-green-300 text-sm">
                      ✅ Congratulations! Your OXN
                      product is authentic and has successfully
                      passed our verification process.
                    </p>
                  </div>
                )}

                {status === "invalid" && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-red-300 text-sm">
                      ❌ This verification code could not be
                      authenticated. Please check the code or
                      contact OXN Support if you believe
                      this is an error.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setName("");
                    setPhone("");
                    setCode("");
                    resetResult();
                  }}
                  className="mt-8 w-full border border-[#FF6A00] hover:bg-[#FF6A00] transition-all duration-300 rounded-xl py-4 text-white font-semibold"
                >
                  Verify Another Product
                </button>

              </div>

            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center">

            <p className="text-white/35 text-sm">
              Protected by
            </p>

            <p className="text-[#FF6A00] font-bold tracking-[0.35em] mt-2 uppercase">
              OXN Security
            </p>

            <p className="text-white/30 text-xs mt-4">
              © {new Date().getFullYear()} OXN.
              All Rights Reserved.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}