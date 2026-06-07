"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Bill Planner", href: "/dashboard/bill-planner" },
  { label: "Settings", href: "/dashboard/settings" },
];

function LeafLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M17 2C11 5 6 11 6 18c0 6 3 11 8 14-.6-4-.3-9 1.5-13.5C17.5 14 21 10 26 8c-3-4-7-6-9-6zm-2 9c-3 4-4.5 9-4 14 4-2.5 6.5-7 7-12 .2-2-.5-3.8-1.5-5.5-4 2-6.5 4.5-8 7.5z" />
    </svg>
  );
}

export function SaaStoNavbar() {
  const [open, setOpen] = useState(false);
  const [loginNoticeOpen, setLoginNoticeOpen] = useState(false);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>) {
    // Future auth interceptor:
    // Replace this hardcoded public preview flag with global auth state.
    // If `isLoggedIn` becomes false, prevent route navigation, close the
    // mobile menu, and show the centered login-required modal below.
    const isLoggedIn = true;

    if (!isLoggedIn) {
      event.preventDefault();
      setOpen(false);
      setLoginNoticeOpen(true);
    }
  }

  return (
    <header className="relative z-50 w-full border-b border-transparent bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[#1a1a2e]"
          aria-label="SaaSto home"
        >
          <LeafLogo className="h-8 w-8 shrink-0 text-[#3DAB6B]" />
          <span className="text-xl font-bold tracking-tight md:text-2xl">
            SaaSto
          </span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 lg:flex lg:items-center lg:gap-10"
          aria-label="Main"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="nav-link-elegant text-[15px] font-medium text-neutral-600"
              onClick={handleNavClick}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="#login"
            className="hidden min-h-[44px] items-center text-[15px] font-semibold text-[#3DAB6B] underline-offset-[6px] decoration-transparent decoration-1 transition-[text-decoration-color] hover:underline hover:decoration-[#3DAB6B] lg:flex"
          >
            Login
          </a>
          <a
            href="#signup"
            className="nav-signup-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#3DAB6B] px-5 text-[15px] font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DAB6B]"
          >
            <span className="relative z-[1]">Sign up</span>
          </a>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#1a1a2e] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-neutral-100 bg-white lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav
          className="mx-auto flex max-w-[1280px] flex-col gap-1 px-5 py-4 md:px-8"
          aria-label="Mobile"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="min-h-[44px] rounded-lg px-2 py-3 text-[15px] font-medium text-neutral-600 hover:bg-neutral-50 hover:text-[#1a1a2e]"
              onClick={(event) => {
                handleNavClick(event);
                setOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="#login"
            className="min-h-[44px] rounded-lg px-2 py-3 text-[15px] font-semibold text-[#3DAB6B] underline-offset-[6px] decoration-transparent decoration-1 transition-[text-decoration-color] hover:underline hover:decoration-[#3DAB6B]"
            onClick={() => setOpen(false)}
          >
            Login
          </a>
        </nav>
      </div>

      {loginNoticeOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#3DAB6B]/10 text-[#3DAB6B]">
              <LeafLogo className="h-8 w-8" />
            </div>
            <h2
              id="login-required-title"
              className="text-2xl font-bold tracking-tight text-[#1a1a2e]"
            >
              Login required
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Please log in to access your secure finance dashboard and account
              tools.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#3DAB6B] px-6 text-sm font-semibold text-white shadow-[0_14px_40px_-12px_rgba(61,171,107,0.55)]"
              onClick={() => setLoginNoticeOpen(false)}
            >
              Continue preview
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
