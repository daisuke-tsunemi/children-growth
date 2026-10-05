/**
 * 丸・三角・四角の積み木を積み上げた、お城のCSSイラスト。
 * 画像を使わずTailwindのクラスだけで表現する(三角は`border`トリック)。
 */
export default function BlockCastle() {
  return (
    <div aria-hidden className="w-full max-w-xs sm:max-w-sm">
      <div className="flex items-end justify-center gap-2">
        <div className="flex flex-col items-center">
          <div className="h-0 w-0 border-r-[24px] border-b-[16px] border-l-[24px] border-r-transparent border-l-transparent border-b-girl-500" />
          <div className="h-12 w-12 rounded-sm bg-girl-500/80 mt-1" />
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-1 h-4 w-4 rounded-full bg-secondary-500" />
          <div className="h-0 w-0 border-r-[28px] border-b-[20px] border-l-[28px] border-r-transparent border-l-transparent border-b-tertiary-500" />
          <div className="relative h-16 w-14 rounded-sm bg-primary-600 mt-1">
            <span className="absolute top-2.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/80" />
            <span className="absolute bottom-0 left-1/2 h-5 w-3 -translate-x-1/2 rounded-t-sm bg-black/15" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-0 w-0 border-r-[24px] border-b-[16px] border-l-[24px] border-r-transparent border-l-transparent border-b-primary-500" />
          <div className="h-12 w-12 rounded-sm bg-primary-500/80 mt-1" />
        </div>
      </div>

      {/* 城壁(土台) */}
      <div className="mt-1 h-4 w-full rounded-sm bg-tertiary-500/40 mt-2" />
    </div>
  );
}
