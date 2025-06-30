"use client";

import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-primary"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Pulsing circular glow */}
      <motion.circle
        cx="100"
        cy="100"
        r="88"
        fill="url(#bgGradient)"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Stylized A */}
      <path
        d="M100 40 L160 160 H140 L120 110 H80 L60 160 H40 L100 40 Z"
        fill="url(#aGradient)"
        stroke="url(#aStroke)"
        strokeWidth="2"
      />

      {/* Glowing triangle inside */}
      <motion.path
        d="M100 70 L130 130 H70 L100 70 Z"
        fill="url(#innerGlow)"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Orbiting electrons (simulate 3D) */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="100"
          cy={100 - (50 + i * 10)}
          r={3.5 - i * 0.5}
          fill="url(#electronGradient)"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            originX: "100px",
            originY: "100px",
          }}
        />
      ))}

      {/* Rotating dashed ring */}
      <motion.circle
        cx="100"
        cy="100"
        r="88"
        stroke="url(#orbitGradient)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          originX: "100px",
          originY: "100px",
        }}
      />

      <defs>
        <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0044ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="aGradient" x1="40" y1="40" x2="160" y2="160">
          <stop offset="0%" stopColor="#00C1FF" />
          <stop offset="100%" stopColor="#0044ff" />
        </linearGradient>

        <linearGradient id="aStroke" x1="40" y1="40" x2="160" y2="160">
          <stop offset="0%" stopColor="#A6E4FF" />
          <stop offset="100%" stopColor="#00B8FF" />
        </linearGradient>

        <linearGradient id="innerGlow" x1="70" y1="70" x2="130" y2="130">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00FFF0" stopOpacity="0.5" />
        </linearGradient>

        <radialGradient id="electronGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFF0" />
          <stop offset="100%" stopColor="#0044ff" />
        </radialGradient>

        <linearGradient id="orbitGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00FFF0" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#0044ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00FFF0" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
