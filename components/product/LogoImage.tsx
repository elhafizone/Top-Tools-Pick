"use client";

import { useState } from "react";

type Props = { src: string; name: string; fallbackClassName: string };

/**
 * Client-side image with a graceful failure path: if the logo URL errors (dead CDN,
 * blocked favicon service), swap to the same initial tile used for products with no logo
 * instead of leaving a broken-image glyph with alt text.
 */
export function LogoImage({ src, name, fallbackClassName }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span aria-hidden="true" className={fallbackClassName}>
        {name.trim().slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
