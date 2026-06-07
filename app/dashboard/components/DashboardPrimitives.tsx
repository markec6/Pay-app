"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const brand = {
  green: "#3DAB6B",
  dark: "#1a1a2e",
  red: "#e85d6f",
};

export const dashboardContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const dashboardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function MotionSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={className}
      variants={dashboardContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
    >
      {children}
    </motion.section>
  );
}

export function MotionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={dashboardItemVariants}
      className={`rounded-3xl border border-white bg-white shadow-[0_18px_55px_-32px_rgba(26,26,46,0.45),0_4px_18px_rgba(26,26,46,0.06)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[#3DAB6B]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#3DAB6B]">
      {children}
    </span>
  );
}

export function ArrowIcon({
  direction,
  className = "",
}: {
  direction: "up" | "down";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "up" ? (
        <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
      ) : (
        <path d="M12 5v14M12 19l-7-7M12 19l7-7" />
      )}
    </svg>
  );
}

export function WalletIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M14 16h28a4 4 0 0 1 4 4v3h-8a5 5 0 0 0 0 10h8v3a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4zm24 11h10v6h-10a3 3 0 1 1 0-6z"
      />
    </svg>
  );
}

export function BillIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} fill="none" aria-hidden>
      <path d="M38 17H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M24 14l-4 3 4 3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 39h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M30 36l4 3-4 3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddCardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} fill="none" aria-hidden>
      <circle cx="28" cy="28" r="18" fill="currentColor" />
      <path d="M28 20v16M20 28h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
