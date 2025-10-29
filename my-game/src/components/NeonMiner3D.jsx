// src/components/NeonMiner3D.jsx
import React from "react";
import { motion } from "framer-motion";
import fanImage from "../assets/blades.png";

export default function NeonMiner3D({ className }) {
  const front = { x: 40, y: 60, w: 260, h: 220, r: 22 };
  const dx = 40, dy = -24;
  const cx = front.x + front.w / 2;
  const cy = front.y + front.h / 2;

  return (
    <div
      className="relative"
      style={{
        marginLeft: "70px",     // فاصله از سمت چپ
        marginRight: "30px",    // فاصله از سمت راست
        filter: "drop-shadow(0 20px 25px rgba(0,255,255,0.25))", // سایه زیر باکس
      }}
    >
      <svg
        viewBox="0 0 420 340"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#7C4DFF" />
          </linearGradient>

          <radialGradient id="panelGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1A1F4D" />
            <stop offset="100%" stopColor="#0A0F2D" />
          </radialGradient>

          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>


        {/* بدنه باکس */}
        <rect
          x={front.x}
          y={front.y}
          width={front.w}
          height={front.h}
          rx={front.r}
          fill="url(#panelGlow)"
          stroke="url(#edge)"
          strokeWidth="5"
          filter="url(#soft)"
        />

        {/* فن متحرک */}
        <g transform={`translate(${cx} ${cy})`}>
          <circle r="106" fill="#0A0F2D" stroke="#00D6FF" strokeWidth="4" />
          <motion.image
            href={fanImage}
            x="-100"
            y="-100"
            width="200"
            height="200"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            style={{
              transformOrigin: "center",
              filter: "drop-shadow(0 0 20px rgba(0,255,255,0.4))",
            }}
          />
          <circle r="42" fill="none" stroke="#7A5CFF" strokeWidth="5" />
        </g>
      </svg>
    </div>
  );
}
