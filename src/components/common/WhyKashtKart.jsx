import { Leaf, Sprout, Sun, HeartPulse, BadgeCheck, Truck } from "lucide-react";

const cards = [
  {
    num: "01",
    icon: <Leaf className="w-4 h-4" />,
    title: "Farm Fresh",
    desc: "Picked and packed on the very same day from the orchard — no middlemen, no delays.",
    tag: "Same Day Harvest",
  },
  {
    num: "02",
    icon: <Sprout className="w-4 h-4" />,
    title: "100% Organic",
    desc: "Grown without pesticides or chemical fertilizers — pure, natural, and safe for your family.",
    tag: "Certified Natural",
  },
  {
    num: "03",
    icon: <Sun className="w-4 h-4" />,
    title: "Naturally Ripened",
    desc: "No calcium carbide — every mango ripened the way nature intended, under the open sky.",
    tag: "Chemical Free",
  },
  {
    num: "04",
    icon: <HeartPulse className="w-4 h-4" />,
    title: "Rich in Nutrients",
    desc: "High in Vitamin C, A, fibre and natural antioxidants — a powerhouse in every bite.",
    tag: "Vitamin Packed",
  },
  {
    num: "05",
    icon: <BadgeCheck className="w-4 h-4" />,
    title: "Quality Checked",
    desc: "Every batch is meticulously inspected before dispatch — zero compromise, always.",
    tag: "Zero Compromise",
  },
  {
    num: "06",
    icon: <Truck className="w-4 h-4" />,
    title: "Farm to Home",
    desc: "Swift, careful delivery ensuring maximum freshness reaches your doorstep, every time.",
    tag: "Express Delivery",
  },
];

const stats = [
  { num: "100%", label: "Organic Farms" },
  { num: "0", label: "Chemicals Used" },
  { num: "24hr", label: "Farm to Door" },
  { num: "5★", label: "Quality Rating" },
];

export default function WhyKashtKart({ addToRefs }) {
  return (
    <section
      id="why-kaashtkart"
      className="relative py-16 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #fff8e8 0%, #fef3d0 35%, #fdedb8 65%, #fef6dc 85%, #ffffff 100%)",
      }}
    >
      <div className="absolute bottom-10 left-2 opacity-40 pointer-events-none">
          <div className="text-9xl">🥭</div>
        </div>
        <div className="absolute top-4 -right-10 opacity-40 pointer-events-none">
          <div className="text-9xl rotate-12">🥭</div>
        </div>
        <div className="absolute bottom-40 left-40 opacity-40 pointer-events-none">
          <div className="text-4xl rotate-[-15deg]">🥭</div>
        </div>
        <div className="absolute top-40 right-16 opacity-40 pointer-events-none">
          <div className="text-3xl rotate-[20deg]">🥭</div>
        </div>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-80px", right: "-80px",
          width: "420px", height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,185,0,0.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-60px", left: "-60px",
          width: "360px", height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,185,0,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(200,140,0,0.08) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 items-stretch">

          <div className="flex flex-col justify-between gap-5">
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-heading, inherit)",
                fontSize: "clamp(38px, 5vw, 62px)",
                fontWeight: 900,
                color: "#1a1000",
                lineHeight: 1.1,
              }}
            >
              Spot The
              <br />
              <span style={{ color: "#c98a00" }}>Goodness</span>
              <br />
              Inside
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div>
              <p
                className="text-sm md:text-base mb-3 leading-relaxed"
                style={{ color: "#5a3d00", fontFamily: "var(--font-body, inherit)" }}
              >
                At KaashtKart, every mango tells a story of purity, passion, and
                perfection. We bring nature's finest straight from the heart of trusted farms.
              </p>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "#5a3d00", fontFamily: "var(--font-body, inherit)" }}
              >
                No chemicals, no shortcuts — just authentic, sun-kissed sweetness
                that captures the true essence of farm-fresh mangoes.
              </p>
            </div>

            <div
              className="rounded-full"
              style={{ width: "40px", height: "3px", background: "#c98a00" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.num}
              className="relative overflow-hidden rounded-xl p-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(210,160,0,0.2)",
                boxShadow: "0 2px 12px rgba(180,120,0,0.07)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(180,120,0,0.15)";
                e.currentTarget.style.borderColor = "rgba(200,140,0,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.65)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(180,120,0,0.07)";
                e.currentTarget.style.borderColor = "rgba(210,160,0,0.2)";
              }}
            >
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(200,140,0,0.4), transparent)",
                }}
              />

              <span
                className="absolute top-4 right-4 font-bold tracking-widest"
                style={{
                  color: "rgba(200,150,0,0.2)",
                  fontFamily: "var(--font-heading, inherit)",
                  fontSize: "12px",
                }}
              >
                {card.num}
              </span>

              <div
                className="flex items-center justify-center rounded-lg mb-4"
                style={{
                  width: "42px", height: "42px",
                  background: "rgba(255,220,80,0.2)",
                  border: "1px solid rgba(200,150,0,0.25)",
                  color: "#9a6500",
                }}
              >
                {card.icon}
              </div>

              <h3
                className="font-bold mb-1.5"
                style={{
                  color: "#2a1800",
                  margin: "0 0 6px",
                  fontSize: "14px",
                  fontFamily: "var(--font-heading, inherit)",
                }}
              >
                {card.title}
              </h3>

              <p
                className="text-xs m-0"
                style={{
                  color: "#7a5820",
                  fontFamily: "var(--font-body, inherit)",
                  lineHeight: 1.65,
                }}
              >
                {card.desc}
              </p>

              <span
                className="inline-block mt-4 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase"
                style={{
                  background: "rgba(255,220,80,0.2)",
                  border: "1px solid rgba(200,150,0,0.25)",
                  color: "#7a5000",
                  fontFamily: "var(--font-heading, inherit)",
                  fontSize: "10px",
                }}
              >
                {card.tag}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl px-7 py-5"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(210,160,0,0.25)",
            boxShadow: "0 2px 20px rgba(180,120,0,0.08)",
          }}
        >
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-5 md:gap-8">
                <div className="text-center">
                  <span
                    className="block leading-none"
                    style={{
                      fontFamily: "var(--font-heading, inherit)",
                      fontSize: "26px",
                      fontWeight: 900,
                      color: "#c98a00",
                    }}
                  >
                    {stat.num}
                  </span>
                  <span
                    className="block mt-1 text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "#8a6020", fontFamily: "var(--font-heading, inherit)" }}
                  >
                    {stat.label}
                  </span>
                </div>
                {i < stats.length - 1 && (
                  <div
                    className="hidden md:block"
                    style={{ width: "1px", height: "32px", background: "rgba(200,150,0,0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200"
            style={{
              background: "#c98a00",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-heading, inherit)",
              letterSpacing: "0.4px",
              boxShadow: "0 4px 14px rgba(180,120,0,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#a06d00";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#c98a00";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}