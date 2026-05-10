"use client";

import { useEffect, useRef, useState } from "react";

const statsConfig = [
  { target: 115, format: (n: number) => `${Math.round(n)}k+` },
  { target: 88, format: (n: number) => `${Math.round(n)}k` },
  { target: 30, format: (n: number) => `${Math.round(n)}%` },
  { target: 10, format: (n: number) => `>${Math.round(n)}k` },
] as const;

const LABELS = [
  "Active user",
  "User passive",
  "Increase in user",
  "Good Testimonials",
] as const;

const DURATION_MS = 1500;
const STAGGER_MS = 150;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState(() => statsConfig.map(() => 0));
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const start = performance.now();

        function tick(now: number) {
          let allComplete = true;
          const next = statsConfig.map((stat, i) => {
            const delay = i * STAGGER_MS;
            const elapsed = now - start - delay;
            if (elapsed <= 0) {
              allComplete = false;
              return 0;
            }
            const t = Math.min(elapsed / DURATION_MS, 1);
            if (t < 1) allComplete = false;
            return stat.target * easeOutCubic(t);
          });
          setValues(next);
          if (!allComplete) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.2, rootMargin: "0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Company statistics"
      className="w-full bg-white py-12"
    >
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-10">
        <div className="flex flex-col md:grid md:max-lg:grid-cols-2 lg:flex lg:flex-row lg:items-stretch">
          {statsConfig.map((stat, i) => {
            const display = stat.format(values[i] ?? 0);
            const label = LABELS[i];

            const borderMobile =
              i < statsConfig.length - 1
                ? "max-md:border-b max-md:border-[#e5e7eb]"
                : "";

            const borderTablet =
              i === 0 || i === 2
                ? "md:max-lg:border-r md:max-lg:border-[#e5e7eb]"
                : "";
            const borderTabletRow =
              i === 0 || i === 1 ? "md:max-lg:border-b md:max-lg:border-[#e5e7eb]" : "";

            const borderDesktop =
              i < statsConfig.length - 1
                ? "lg:border-r lg:border-[#e5e7eb]"
                : "";

            return (
              <div
                key={label}
                className={`flex flex-1 flex-col items-center justify-center px-5 py-8 text-center sm:px-6 md:py-10 lg:flex-1 lg:px-8 lg:py-14 xl:px-10 ${borderMobile} ${borderTablet} ${borderTabletRow} ${borderDesktop}`}
              >
                <p className="text-[2.75rem] font-bold leading-none tracking-tight text-[#1a1a2e] sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
                  {display}
                </p>
                <p className="mt-3 text-sm font-normal leading-snug text-gray-500 lg:text-[15px]">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
