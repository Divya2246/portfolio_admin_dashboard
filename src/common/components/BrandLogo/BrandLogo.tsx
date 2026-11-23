interface BrandLogoProps {
  /** Show ankitpatil.com under the name. */
  showDomain?: boolean;
}

export function BrandLogo({ showDomain = false }: BrandLogoProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-accent text-[13px] font-semibold tracking-tight text-accent-contrast shadow-[0_10px_24px_-14px_rgb(var(--accent)/0.95)]"
        aria-hidden
      >
        AP
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold tracking-tight text-ink sm:text-base">Divya</span>
        {showDomain ? <span className="block truncate text-[11px] text-muted">ankitpatil.com</span> : null}
      </span>
    </span>
  );
}
