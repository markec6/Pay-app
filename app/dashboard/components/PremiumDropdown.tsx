"use client";

import { useEffect, useRef, useState } from "react";

type PremiumDropdownProps<TValue extends string> = {
  value: TValue;
  options: readonly TValue[];
  onChange: (value: TValue) => void;
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m4.5 10.5 3.2 3.2 7.8-8" />
    </svg>
  );
}

export function PremiumDropdown<TValue extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
  triggerClassName = "",
  menuClassName = "",
}: PremiumDropdownProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#1a1a2e] shadow-sm transition-all duration-200 hover:border-[#3DAB6B]/40 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-emerald-50/50 ${triggerClassName}`}
      >
        <span>{value}</span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute right-0 z-[100] mt-2 w-32 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-xl outline-none animate-in fade-in slide-in-from-top-2 duration-150 ${menuClassName}`}
        >
          {options.map((option) => {
            const active = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
                  active
                    ? "bg-emerald-50/60 text-[#3DAB6B]"
                    : "text-neutral-600 hover:bg-emerald-50/40 hover:text-[#3DAB6B]"
                }`}
              >
                <span>{option}</span>
                {active ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
