export function HappyUsersSection() {
  return (
    <section
      className="w-full bg-white py-20 text-[#1a1a2e]"
      aria-labelledby="happy-users-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="happy-users-heading"
          className="text-balance text-center text-3xl font-extrabold tracking-tight text-[#1a1a2e] lg:text-4xl"
        >
          There Is A Lot Of Happy Users
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-gray-500">
          Just a real experience
        </p>

        {/* Phone + floating avatars — mockup unchanged */}
        <div className="mx-auto mt-14 flex w-full justify-center px-4 sm:mt-16 sm:px-8 md:mt-20">
          <div className="relative w-[min(156px,42vw)] shrink-0 sm:w-[min(174px,44vw)] md:w-[min(186px,36vw)] lg:w-[min(198px,30vw)]">
            <img
              src="/assets/exports-img-mockup.png"
              alt=""
              className="relative z-10 mx-auto h-auto w-full object-contain drop-shadow-[0_16px_36px_rgba(26,26,46,0.5)]"
            />

            {/* Avatar 1 — close, in front of phone */}
            <div className="happy-users-avatar-root absolute left-[-50%] top-[14%] z-30 h-[70px] w-[70px] sm:left-[-50%] sm:top-[18%]">
              <div className="happy-users-avatar-live happy-users-avatar-live--1 h-full w-full">
                <div className="happy-users-avatar-clip h-full w-full">
                  <img
                    src="/assets/user-1.png"
                    alt=""
                    className="happy-users-avatar-img max-h-none max-w-none"
                  />
                </div>
              </div>
            </div>

            {/* Avatar 2 — close, tucked behind phone edge */}
            <div className="happy-users-avatar-root absolute right-[-12%] top-[9%] z-[8] h-[85px] w-[85px] translate-x-[42%] sm:right-[-12%] sm:top-[11%] sm:translate-x-[46%]">
              <div className="happy-users-avatar-live happy-users-avatar-live--2 h-full w-full">
                <div className="happy-users-avatar-clip h-full w-full">
                  <img
                    src="/assets/user-2.png"
                    alt=""
                    className="happy-users-avatar-img max-h-none max-w-none"
                  />
                </div>
              </div>
            </div>

            {/* Avatar 3 — further out (floating) */}
            <div className="happy-users-avatar-root absolute right-[-46%] top-[62%] z-20 h-[60px] w-[60px] sm:right-[-65%] sm:top-[68%]">
              <div className="happy-users-avatar-live happy-users-avatar-live--3 h-full w-full">
                <div className="happy-users-avatar-clip h-full w-full">
                  <img
                    src="/assets/user-3.png"
                    alt=""
                    className="happy-users-avatar-img max-h-none max-w-none"
                  />
                </div>
              </div>
            </div>

            {/* Avatar 4 — further out (floating) */}
            <div className="happy-users-avatar-root absolute bottom-[14%] left-[-34%] z-[25] h-[90px] w-[90px] sm:bottom-[12%] sm:left-[-36%]">
              <div className="happy-users-avatar-live happy-users-avatar-live--4 h-full w-full">
                <div className="happy-users-avatar-clip h-full w-full">
                  <img
                    src="/assets/user-4.png"
                    alt=""
                    className="happy-users-avatar-img max-h-none max-w-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-16 max-w-3xl border-x border-gray-200 px-6 sm:mt-20 sm:px-10 md:px-14">
          <blockquote className="text-center">
            <p className="text-base leading-relaxed text-gray-500 md:text-[17px] md:leading-relaxed">
              SaaSto has transformed how we manage transactions. The intuitive
              dashboard and fast payment processing have allowed us to focus on
              scaling our business, knowing our finances are streamlined and
              secure at all times.
            </p>
            <footer className="mt-6 text-center text-sm text-gray-500 md:text-base">
              —{" "}
              <span className="font-semibold text-[#374151]">
                Rebecca Shaw
              </span>
              , CEO, Tech Solutions Inc.
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
