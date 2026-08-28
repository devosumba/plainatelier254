// The gif has 152 frames totalling 507 centiseconds (~5.07s) per loop —
// callers use this to keep the loader on screen for at least one full loop.
export const LOADER_LOOP_DURATION_MS = 5070;

type LoaderProps = {
  size?: number;
  className?: string;
};

export default function Loader({ size = 96, className = "" }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/loader/wozza-loader.gif"
        alt="Loading"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
