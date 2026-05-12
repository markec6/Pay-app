"use client";

import { useEffect, useRef, type RefObject } from "react";

const cardGreen =
  "rounded-2xl border border-[#3DAB6B] bg-[#3DAB6B] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] md:shadow-[0_8px_30px_rgba(61,171,107,0.35)]";

const cardPurple =
  "rounded-2xl border border-[#7C3AED] bg-[#7C3AED] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] md:shadow-[0_8px_30px_rgba(124,58,237,0.35)]";

const placeholderBody =
  "An enim nullam tempor sapien gravida donec enim ipsum porta justo congue magna at pretium purus pretium ligula";

const FEAT_IO_OPTS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px",
};

function usePlatformAnimate(ref: RefObject<HTMLElement | null>) {
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

/** Light / mint stroke on brutal green — mirrors Bitcoin card sparkline weight */
function SparklineEthWave({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 22"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polyline
        points="2,4 14,14 26,7 38,17 50,9 62,15 74,8 86,19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklineWhite({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 22"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polyline
        points="2,16 14,8 26,14 38,5 50,11 62,6 74,12 86,3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlatformSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePlatformAnimate(rootRef);

  return (
    <section className="w-full bg-white py-20">
      <div
        ref={rootRef}
        className="features-platform-mockup mx-auto max-w-6xl px-6"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-1 flex w-full justify-center lg:order-1 lg:justify-start">
            <div className="relative mx-auto w-full max-w-[min(320px,88vw)] lg:max-w-[340px]">
              <img
                src="/assets/platform-sec-img.png"
                alt=""
                className="relative z-10 mx-auto h-auto w-full object-contain drop-shadow-[0_18px_48px_rgba(26,26,46,0.14)]"
              />

              <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
                {/* ETH — fused top-right (mirrors Bitcoin stat card) */}
                <div className="pointer-events-auto absolute -right-4 top-[4%] z-30 sm:-right-3 md:top-[3%] lg:right-0 lg:top-[2%]">
                  <div className="hero-card-enter--dollar">
                    <div className={`w-[min(140px,40vw)] ${cardGreen}`}>
                      <p className="text-[13px] font-bold leading-tight text-white">
                        ETH
                      </p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight text-white md:text-xl">
                        159.2K
                      </p>
                      <div className="mt-1 flex items-center gap-0.5 text-[12px] font-bold text-white">
                        <span>15% ↓</span>
                      </div>
                      <SparklineEthWave className="mt-2 h-5 w-full text-[#ecfdf5]" />
                    </div>
                  </div>
                </div>

                {/* Bitcoin — fused bottom-right */}
                <div className="pointer-events-auto absolute -right-4 bottom-[14%] z-30 sm:-right-3 md:bottom-[16%] lg:right-0 lg:bottom-[15%]">
                  <div className="hero-card-enter--transactions">
                    <div className={`w-[min(160px,46vw)] ${cardPurple}`}>
                      <p className="text-[13px] font-bold leading-tight text-white">
                        Bitcoin
                      </p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight text-white md:text-xl">
                        131.2K
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[12px] font-bold text-white">
                        <span>12%</span>
                        <span className="opacity-90">+</span>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden
                        >
                          <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                        </svg>
                      </div>
                      <SparklineWhite className="mt-2 h-5 w-full text-white/95" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 flex w-full flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
            <h2 className="text-balance text-3xl font-extrabold leading-tight text-[#1a1a2e] lg:text-4xl">
              Platform To Make It Easier For Users
            </h2>
            <p className="mt-5 max-w-xl text-base text-gray-500 text-balance">
              {placeholderBody}
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-4 max-lg:mx-auto lg:max-w-none lg:flex-row lg:gap-5">
              <button
                type="button"
                className="flex w-full flex-col items-center rounded-2xl border border-[#3DAB6B] bg-[#3DAB6B] px-5 py-5 text-center shadow-[0_12px_36px_-10px_rgba(61,171,107,0.45),0_4px_16px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DAB6B] lg:min-h-[142px] lg:max-w-[260px] lg:flex-1 lg:items-start lg:text-left"
              >
                <span className="text-base font-bold text-white">Checkout</span>
                <span className="mt-2 text-[13px] leading-snug text-white/90">
                  Accept payment by starting the link!
                </span>
              </button>

              <button
                type="button"
                className="flex w-full flex-col items-center rounded-2xl border border-[#3DAB6B] bg-white px-5 py-5 text-center shadow-[0_4px_18px_rgba(26,26,46,0.08)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DAB6B] lg:min-h-[142px] lg:max-w-[260px] lg:flex-1 lg:items-start lg:text-left"
              >
                <span className="text-base font-bold text-[#1a1a2e]">
                  Integration
                </span>
                <span className="mt-2 text-[13px] font-semibold leading-snug text-[#3DAB6B] underline underline-offset-2">
                  Accept payment by starting the link!
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
