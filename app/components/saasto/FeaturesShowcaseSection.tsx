"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "Bill Payment",
    description:
      "Make paying your bills quick and effortless directly through the app.",
    icon: IconBillArrows,
  },
  {
    title: "Withdraw Money",
    description:
      "Securely withdraw funds to your bank or linked cards with just a few taps.",
    icon: IconWallet,
  },
  {
    title: "Add Card",
    description:
      "Make paying your bills quick and effortless directly through the app.",
    icon: IconAddCard,
  },
  {
    title: "History",
    description:
      "Quickly view your transaction history with all recent payments and transfers.",
    icon: IconHistory,
  },
] as const;

function IconBillArrows(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      className={props.className}
      aria-hidden
    >
      <path
        d="M38 17H20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 14l-4 3 4 3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 39h16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
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

function IconWallet(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      className={props.className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M14 16h28a4 4 0 0 1 4 4v3h-8a5 5 0 0 0 0 10h8v3a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4zm24 11h10v6h-10a3 3 0 1 1 0-6z"
      />
    </svg>
  );
}

function IconAddCard(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      className={props.className}
      aria-hidden
    >
      <circle cx="28" cy="28" r="18" fill="currentColor" />
      <path
        d="M28 20v16M20 28h16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHistory(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      className={props.className}
      aria-hidden
    >
      <circle
        cx="26"
        cy="26"
        r="11"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M26 21v6l4 2.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 26a11 11 0 0 1 4.5-8.85"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 17l2.5 3M17 17h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small gear overlapping bottom-right */}
      <g transform="translate(32 30)">
        <circle cx="10" cy="10" r="7" fill="white" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 6v2.5M10 11.5V14M6 10h2.5M11.5 10H14M7.05 7.05l1.77 1.77M11.18 11.18l1.77 1.77M7.05 12.95l1.77-1.77M11.18 8.82l1.77-1.77"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}

export function FeaturesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrap = cardsWrapRef.current;
    if (!section || !wrap) return;

    const cards = gsap.utils.toArray<HTMLElement>(wrap.children);
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-24"
      aria-labelledby="features-showcase-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="features-showcase-heading"
            className="text-3xl font-extrabold tracking-tight text-[#1a1a2e] lg:text-4xl"
          >
            Some Excellent Features For You
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-500 text-balance">
            An enim nullam tempor sapien gravida donec enim ipsum porta justo
            congue magna at pretium purus pretium ligula
          </p>
        </header>

        <div
          ref={cardsWrapRef}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex w-full flex-col items-center rounded-xl border border-gray-100 bg-white px-6 py-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1),0_25px_50px_-12px_rgba(0,0,0,0.14)] lg:py-10"
              >
                <div className="mb-4 flex shrink-0 items-center justify-center text-[#3DAB6B] lg:mb-5">
                  <Icon className="h-14 w-14 lg:h-16 lg:w-16" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a2e]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 text-balance lg:mt-3">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
