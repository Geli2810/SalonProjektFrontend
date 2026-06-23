import React from "react";

// Genbrugelig animeret sakse/hår baggrund til hele Salon Royale.
// Brug: læg <SalonBackground /> som det FØRSTE element inde i din sides yderste <div>,
// og sørg for at den yderste div har position: "relative" og overflow: "hidden".
export default function SalonBackground() {
  // Genererer en række svævende ikoner med tilfældige positioner/forsinkelser
  const items = [
    { icon: "✂", size: 90, top: "12%", left: "8%", dur: 18, delay: 0, op: 0.05 },
    { icon: "✂", size: 50, top: "70%", left: "5%", dur: 22, delay: 3, op: 0.04 },
    { icon: "✂", size: 70, top: "30%", left: "85%", dur: 20, delay: 1, op: 0.05 },
    { icon: "✂", size: 40, top: "85%", left: "78%", dur: 26, delay: 5, op: 0.035 },
    { icon: "💈", size: 60, top: "55%", left: "90%", dur: 24, delay: 2, op: 0.04 },
    { icon: "💈", size: 45, top: "18%", left: "55%", dur: 28, delay: 4, op: 0.03 },
    { icon: "🪮", size: 55, top: "78%", left: "40%", dur: 21, delay: 1.5, op: 0.04 },
    { icon: "🪮", size: 38, top: "8%", left: "32%", dur: 25, delay: 6, op: 0.03 },
    { icon: "✂", size: 60, top: "45%", left: "20%", dur: 23, delay: 2.5, op: 0.04 },
    { icon: "💇", size: 65, top: "60%", left: "60%", dur: 27, delay: 3.5, op: 0.035 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0
      }}
    >
      <style>{`
        @keyframes salonFloat {
          0%   { transform: translateY(0px) rotate(0deg); }
          25%  { transform: translateY(-30px) rotate(8deg); }
          50%  { transform: translateY(-10px) rotate(-6deg); }
          75%  { transform: translateY(-40px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes salonScissors {
          0%, 100% { transform: rotate(-12deg); }
          50%      { transform: rotate(12deg); }
        }
        @keyframes salonBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.1); }
          66%      { transform: translate(-30px,20px) scale(0.95); }
        }
        .salon-float-item {
          position: absolute;
          user-select: none;
          will-change: transform;
        }
        .salon-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          will-change: transform;
        }
      `}</style>

      {/* Bløde blå lys-blobs der bevæger sig */}
      <div className="salon-blob" style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(24,95,165,0.18) 0%, transparent 70%)",
        top: "-120px", left: "-100px",
        animation: "salonBlob 16s ease-in-out infinite"
      }} />
      <div className="salon-blob" style={{
        width: 420, height: 420,
        background: "radial-gradient(circle, rgba(55,138,221,0.14) 0%, transparent 70%)",
        bottom: "-80px", right: "-60px",
        animation: "salonBlob 20s ease-in-out infinite reverse"
      }} />
      <div className="salon-blob" style={{
        width: 350, height: 350,
        background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
        top: "40%", left: "45%",
        animation: "salonBlob 24s ease-in-out infinite"
      }} />

      {/* Svævende sakse / barber-ikoner */}
      {items.map((it, i) => (
        <div
          key={i}
          className="salon-float-item"
          style={{
            top: it.top,
            left: it.left,
            fontSize: it.size,
            opacity: it.op,
            color: "#60a5fa",
            animation: `salonFloat ${it.dur}s ease-in-out ${it.delay}s infinite`
          }}
        >
          <span style={{
            display: "inline-block",
            animation: it.icon === "✂" ? `salonScissors ${it.dur / 2}s ease-in-out infinite` : "none"
          }}>
            {it.icon}
          </span>
        </div>
      ))}
    </div>
  );
}