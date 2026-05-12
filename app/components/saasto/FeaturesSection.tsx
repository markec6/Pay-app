"use client";

import { useEffect, useRef, type RefObject } from "react";

// Identičan stil za sve male bele divove (i gore i dole)
const SMALL_WHITE_CARD = 
  "rounded-xl border border-white/80 bg-white px-4 py-3 flex items-center gap-3";

/** Matches AnimatedHeroSection (IntersectionObserver on `.hero-section` → `.hero-animate`). */
const FEAT_IO_OPTS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px",
};

/** Toggles `.animate-in` when the subtree enters/leaves the viewport so entrance animations re-run on each visit. */
function useFeatAnimate(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle("animate-in", entry.isIntersecting);
    }, FEAT_IO_OPTS);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

export function FeaturesSection() {
  const payRef = useRef<HTMLDivElement>(null);
  const histRef = useRef<HTMLDivElement>(null);

  useFeatAnimate(payRef);
  useFeatAnimate(histRef);

  return (
    <section className="w-full overflow-x-clip bg-white py-20">
      
      {/* GORNJI DEO (Payments) */}
      <div ref={payRef} className="features-pay-mockup mx-auto max-w-6xl px-6 pb-44">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-[320px]">
              <img src="/assets/Payments1.png" alt="" className="h-auto w-full object-contain" />
              <div className="absolute -left-12 -top-8 ">
                <div className="hero-card-enter--education">
                <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3DAB6B] text-white">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>
                    <p className="text-[12px] font-bold text-[#1a1a2e]">Transfer successfully done</p>
                  </div>
                </div>
                </div>
              </div>
              <div className="absolute -right-8 top-[15%]">
                <div className="hero-card-enter--dollar">
                <div className={`${SMALL_WHITE_CARD} shadow-lg`}>
                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3DAB6B] text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17 17 7M17 7v4M17 7h-4"/></svg></div>
                   <p className="text-[14px] font-bold text-[#1a1a2e]">+111,239$</p>
                </div>
                </div>
              </div>
              <div className="absolute -right-10 bottom-[20%]">
                <div className="hero-card-enter--transactions">
                <div className={`${SMALL_WHITE_CARD} shadow-lg`}>
                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e85d6f] text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 7 7 17M7 17v-4M7 17h4"/></svg></div>
                   <p className="text-[14px] font-bold text-[#1a1a2e]">-82,475$</p>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left w-full">
            <h2 className="text-3xl font-extrabold leading-tight text-[#1a1a2e] lg:text-4xl">
              Quick And Easy Payments With Just A Few Clicks
            </h2>
            <p className="mt-5 text-base text-gray-500 text-balance w-full">
              An enim nullam tempor sapien gravida donec enim ipsum porta justo congue magna at pretium purus pretium ligula
            </p>
            <button
              type="button"
              className="mt-8 mx-auto rounded-full bg-[#3DAB6B] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition-transform hover:scale-105 lg:mx-0 lg:self-start"
            >
              Start 14 Days Trial
            </button>
          </div>
        </div>
      </div>

      {/* DONJI DEO (History) */}
      <div ref={histRef} className="features-hist-mockup mx-auto max-w-6xl px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-30">
          <div className="flex w-full flex-col items-center text-center lg:order-1 lg:w-1/2 lg:items-start lg:text-left">
            <h2 className="text-3xl font-extrabold leading-tight text-[#1a1a2e] lg:text-4xl">
              You Can View Transaction History Easily
            </h2>
            <p className="mt-5 text-base text-gray-500">
              An enim nullam tempor sapien gravida donec enim ipsum porta justo congue magna at pretium purus pretium ligula
            </p>
            <a
              href="#"
              className="mt-6 inline-block font-bold text-[#3DAB6B] hover:underline"
            >
              Get started &gt;&gt;
            </a>
          </div>

          <div className="relative w-full lg:order-2 lg:w-1/2">
            <div className="relative mx-auto max-w-[320px]">
              <img src="/assets/Payments2.png" alt="" className="h-auto w-full object-contain rounded-[2rem]" />

              {/* PLAVI DIV */}
              <div className="absolute left-[-10%] top-[-20%] z-30">
                <div className="hero-card-enter--education flex flex-col">
                  <div className="w-full rounded-t-lg bg-[#3DAB6B] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    Connected Card
                  </div>
                  <div className="rounded-b-xl bg-[#2D58A7] px-4 pb-[12px] shadow-2xl shadow-blue-900/40 flex flex-row justify-between items-center gap-[16px]">
                    <div className="flex items-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-8 text-white/90" fill="currentColor"><path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h8v4H8v-4z"/></svg>
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-bold text-white">Halca Alane</p>
                      <p className="mt-1 font-mono text-[10px] tracking-widest text-white/80">1234 **** 5090 6620</p>
                    </div>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  </div>
                </div>
              </div>

              {/* DRIBBBLE PRO */}
              <div className="hero-card-enter--transactions absolute -left-10 top-[28%] z-20">
                <div className={`${SMALL_WHITE_CARD} shadow-2xl shadow-black/20`}>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ea4c89] text-[8px] font-bold text-white">Dr</div>
                  <div className="flex w-full items-center justify-between gap-[24px]">
                    <span className="text-[12px] font-bold text-[#1a1a2e]">Dribbble Pro</span>
                    <span className="text-[10px] font-extrabold text-[#1a1a2e]">-$2,114</span>
                  </div>
                </div>
              </div>

              {/* NETFLIX */}
              <div className="hero-card-enter--dollar absolute -left-10 top-[52%] z-20">
                <div className={`${SMALL_WHITE_CARD} shadow-2xl shadow-black/20`}>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[9px] font-bold text-red-600">N</div>
                  <div className="flex w-full items-center justify-between gap-[24px]">
                    <span className="text-[12px] font-bold text-[#1a1a2e]">Netflix</span>
                    <span className="text-[10px] font-extrabold text-[#1a1a2e]">-$2,114</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
