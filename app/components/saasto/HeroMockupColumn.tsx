import Image from "next/image";

const accent = "#3DAB6B";

/** Mobile: readable solid panels + shadow; md+: prior glass depth */
const cardWhite =
  "rounded-2xl border border-white bg-[rgba(255,255,255,0.97)] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-[6px] [-webkit-backdrop-filter:blur(6px)] md:bg-[rgba(255,255,255,0.96)] md:shadow-[0_8px_30px_rgba(0,0,0,0.14)]";

const cardGreen =
  "rounded-2xl border border-[#3DAB6B] bg-[#3DAB6B] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)] md:shadow-[0_8px_30px_rgba(61,171,107,0.35)]";

const chartHeightsSm = [10, 16, 8, 18, 12, 22, 11];
const chartHeightsLg = [14, 22, 11, 26, 17, 30, 15];

export function HeroMockupColumn() {
  return (
    <div className="relative flex w-full min-w-0 max-w-full justify-between md:justify-end">
      <div
        className="hero-blob-wrap pointer-events-none absolute left-1/2 top-[46%] z-0 flex aspect-square w-[min(88vw,280px)] max-w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:w-[min(85vw,320px)] md:left-[52%] md:top-[48%] md:w-[min(360px,calc(100%-1rem))] lg:w-[min(400px,100%)] xl:w-[420px]"
        aria-hidden
      >
        <div className="hero-blob-spin h-full w-full max-w-full rounded-[45%] bg-gradient-to-br from-[#E8E0FF] via-[#DDD6FE] to-[#E9D5FF] blur-[52px]" />
      </div>

      <div className="relative z-[1] w-full min-w-0 max-w-full lg:flex lg:max-w-none lg:justify-end">
        {/* Phone wrapper: mobile breathing room + overflow visible for cards */}
        <div className="relative mx-6 mt-4 mb-8 w-full max-w-full overflow-visible md:mx-auto md:mt-0 md:mb-0 md:max-w-md lg:mx-0 lg:max-w-none">
          <div className="relative mx-auto w-full max-w-sm overflow-visible md:max-w-none">
            <div className="hero-phone-stage relative z-10 mx-auto w-full max-w-full">
              <Image
                src="/assets/Mockup-hero.png"
                alt="SaaSto finance app running on two phones"
                width={356}
                height={505}
                className="mx-auto h-auto w-full max-w-full object-contain max-md:max-h-[320px] md:max-h-[460px] lg:max-h-[500px]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 380px"
                priority
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 block overflow-visible">
              {/* US Dollar — mobile: right -16px top 5%; md+ anchored */}
              <div className="pointer-events-auto absolute -right-4 top-[5%] z-30 md:right-0 md:top-[3%] xl:top-[2%]">
                <div className="hero-card-enter--dollar">
                  <div
                    className={`min-w-[130px] max-w-[140px] md:max-w-[160px] lg:w-[148px] lg:max-w-none xl:w-[156px] ${cardWhite}`}
                  >
                    <p className="mb-1 text-xs text-gray-500 md:text-[13px] md:text-[#6b7280]">
                      US Dollar
                    </p>
                    <p className="mb-2 text-sm font-bold text-[#1a1a2e] md:text-base">
                      $25,685.55
                    </p>
                    <button
                      type="button"
                      className="w-full rounded-full bg-[#3DAB6B] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#329558] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DAB6B] md:text-[11px]"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>

              {/* Education — inset 8px, never clipped */}
              <div className="absolute left-[8px] top-[8px] z-30">
                <div className="hero-card-enter--education">
                  <div
                    className={`min-w-[110px] md:min-w-0 md:max-w-[140px] lg:w-[148px] lg:max-w-none xl:w-[158px] ${cardGreen}`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-white md:text-[13px]">
                        Education
                      </p>
                      <p className="text-base font-bold leading-tight text-white md:text-lg lg:text-xl">
                        $943.65
                      </p>
                      <p className="text-xs leading-tight text-white md:text-[13px]">
                        XXXX 7251
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions — mobile: left -16px bottom 10% */}
              <div className="pointer-events-auto absolute bottom-[10%] -left-4 z-30 md:bottom-[18%] md:left-0 xl:bottom-[16%]">
                <div className="hero-card-enter--transactions">
                  <div
                    className={`min-w-[140px] max-w-[150px] md:max-w-[168px] lg:w-[168px] lg:max-w-none xl:w-[178px] ${cardWhite}`}
                  >
                    <div className="mb-2 flex h-8 items-end gap-0.5 px-0.5 md:h-10">
                      {chartHeightsSm.map((hpx, i) => (
                        <div
                          key={`s-${i}`}
                          className="flex-1 rounded-t-sm md:hidden"
                          style={{
                            height: `${hpx}px`,
                            backgroundColor:
                              i % 2 === 0 ? accent : "#A8D8EA",
                          }}
                        />
                      ))}
                      {chartHeightsLg.map((hpx, i) => (
                        <div
                          key={`l-${i}`}
                          className="hidden flex-1 rounded-t-sm md:flex"
                          style={{
                            height: `${hpx}px`,
                            backgroundColor:
                              i % 2 === 0 ? accent : "#A8D8EA",
                          }}
                        />
                      ))}
                    </div>
                    <ul className="border-t border-gray-100 pt-2 md:border-neutral-200">
                      <li className="flex items-center justify-between border-b border-gray-100 py-1">
                        <span className="text-xs text-[#1a1a2e] md:text-[#6b7280]">
                          Guy Hawkins
                        </span>
                        <span className="text-xs font-semibold text-[#16a34a]">
                          +$120.50
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-b border-gray-100 py-1">
                        <span className="text-xs text-[#1a1a2e] md:text-[#6b7280]">
                          Marvin McKinney
                        </span>
                        <span className="text-xs font-semibold text-[#dc2626]">
                          -$45.00
                        </span>
                      </li>
                      <li className="flex items-center justify-between py-1">
                        <span className="text-xs text-[#1a1a2e] md:text-[#6b7280]">
                          Devon Lane
                        </span>
                        <span className="text-xs font-semibold text-[#16a34a]">
                          +$89.20
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
