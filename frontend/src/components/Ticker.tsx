

const items = [
  '100% WHEY PROTEIN',
  'PREMIUM QUALITY',
  'LAB TESTED',
  'BUILD MUSCLE',
  'INCREASE STRENGTH',
  'FASTER RECOVERY',
  'NO COMPROMISE',
  'OXN NUTRITION',
];

export default function Ticker() {

  const doubled = [...items, ...items];

  return (

    <section className="relative overflow-hidden bg-black border-y border-[#1976C5]/30">

      {/* Gold Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1976C5]/10 via-transparent to-[#1976C5]/10" />

      <div className="relative py-5">

        <div className="ticker-track">

          {doubled.map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-8 px-8"
            >

              <span className="text-[#1976C5] text-2xl font-black">
                ★
              </span>

              <span className="text-white font-bold uppercase tracking-[0.25em] whitespace-nowrap text-lg">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}

