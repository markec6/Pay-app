"use client";

import { useEffect, useRef } from "react";
import { HeroMockupColumn } from "./HeroMockupColumn";

export function AnimatedHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("hero-animate");
        } else {
          section.classList.remove("hero-animate");
        }
      },
      { threshold: 0.12, rootMargin: "0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ contain: "paint" }}
      className="hero-section mx-auto flex min-h-0 w-full min-w-0 max-w-[1280px] flex-1 flex-col overflow-x-hidden px-4 pt-6 pb-10 md:px-8 md:pt-14 md:pb-14 lg:px-10 lg:pt-16 lg:pb-16"
    >
      <div className="grid min-h-0 min-w-0 max-h-full w-full flex-1 grid-cols-1 items-center gap-12 overflow-x-hidden md:grid-cols-[minmax(0,46%)_minmax(0,54%)] md:gap-12 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:gap-12">
        {/* Left column */}
        <div className="mx-auto flex min-h-0 min-w-0 max-h-full w-full max-w-xl flex-col items-center justify-center text-center md:mx-0 md:max-w-none md:items-start md:justify-center md:text-left">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-[#1a1a2e] leading-[1.32] sm:text-[2.25rem] sm:leading-[1.28] md:text-[2.5rem] md:leading-[1.22] lg:text-5xl lg:leading-[1.15]">
            <span className="hero-heading-plain inline-block">
              Manage Your Business{" "}
            </span>
            <span className="hero-heading-finance inline-block text-[#3DAB6B]">
              Finance
            </span>
            <span className="hero-heading-tail inline-block"> Easily</span>
          </h1>
          <p className="hero-subtext mt-5 max-w-lg text-[16px] leading-relaxed text-neutral-600 sm:text-[16px] md:mt-5 md:text-base lg:text-[17px] lg:leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <div className="hero-cta-wrap mt-8 flex w-full justify-center md:mt-8 md:justify-start">
            <a
              href="#trial"
              className="hero-cta-btn inline-flex items-center justify-center rounded-full bg-[#3DAB6B] px-8 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_-12px_rgba(61,171,107,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DAB6B]"
            >
              <span className="relative z-[1]">Start 14 Days Trial</span>
            </a>
          </div>
        </div>

        {/* Right column */}
        <div
          style={{ isolation: "isolate", contain: "paint" }}
          className="relative mx-auto mt-8 flex min-h-0 w-full min-w-0 max-w-full justify-center md:mt-0 md:max-w-none md:justify-self-end md:pr-8 lg:pr-12 xl:pr-14"
        >
          <HeroMockupColumn />
        </div>
      </div>
    </section>
  );
}
