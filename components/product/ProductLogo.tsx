const SIZES = {
  sm: { box: "h-10 w-10", text: "text-sm" },
  md: { box: "h-12 w-12", text: "text-base" },
  lg: { box: "h-16 w-16", text: "text-xl" },
  xl: { box: "h-20 w-20 sm:h-[5.5rem] sm:w-[5.5rem]", text: "text-2xl sm:text-3xl" },
} as const;

type Props = {
  name: string;
  logoUrl?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Product identity mark.
 *
 * `Product.logoUrl` was stored but never rendered anywhere on the site, so every tool
 * was represented by the same grey initial and products read as database rows. Where a
 * logo exists it is now the first thing on the card, the row and the review header.
 *
 * The fallback is the initial in a branded tile rather than an empty box, so a product
 * without a logo still has a consistent silhouette and grids never go ragged.
 *
 * Logos live on arbitrary vendor CDNs, so this uses a plain `img` - the same decision
 * the article images already make - instead of adding every vendor host to the image
 * config. `onError` is unavailable in a server component, so a broken URL falls back to
 * the tile background showing through rather than a broken-image glyph.
 */
export function ProductLogo({ name, logoUrl, size = "md", className = "" }: Props) {
  const styles = SIZES[size];

  if (!logoUrl) {
    return (
      <span
        aria-hidden="true"
        className={`logo-tile logo-tile-fallback ${styles.box} ${styles.text} ${className}`}
      >
        {name.trim().slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={`logo-tile ${styles.box} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoUrl} alt={`${name} logo`} loading="lazy" decoding="async" />
    </span>
  );
}
