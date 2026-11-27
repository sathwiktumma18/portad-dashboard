import Image from "next/image";
import Link from "next/link";

const MARK_RATIO = 560 / 512;

export function LogoMark({
  width = 40,
  className,
  priority = false,
}: {
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={width}
      height={Math.round(width * MARK_RATIO)}
      className={className}
      priority={priority}
    />
  );
}

export function LogoTile({
  size = 40,
  markWidth,
  className,
  priority = false,
}: {
  size?: number;
  markWidth?: number;
  className?: string;
  priority?: boolean;
}) {
  const mark = markWidth ?? Math.round(size * 0.64);
  return (
    <span
      className={
        "grid shrink-0 place-items-center rounded-[26%] bg-white shadow-[0_4px_16px_-4px_rgba(22,104,255,0.35)] ring-1 ring-slate-200/90 dark:shadow-[0_6px_20px_-8px_rgba(22,104,255,0.55)] dark:ring-white/60 " +
        (className ?? "")
      }
      style={{ width: size, height: size }}
    >
      <LogoMark width={mark} priority={priority} />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={
        "text-[17px] font-semibold tracking-tight text-frost-50 " + (className ?? "")
      }
    >
      Porta<span className="text-brand-600 dark:text-brand-400">D</span>
    </span>
  );
}

export function BrandLogo({
  size = 36,
  withWordmark = true,
  priority = false,
  href = "/",
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  priority?: boolean;
  href?: string;
  className?: string;
}) {
  const content = (
    <span className={"flex items-center gap-2.5 " + (className ?? "")}>
      <LogoTile size={size} priority={priority} />
      {withWordmark && <Wordmark />}
    </span>
  );
  if (!href) return content;
  return (
    <Link href={href} className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70">
      {content}
    </Link>
  );
}
