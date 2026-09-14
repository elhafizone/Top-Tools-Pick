const GENERIC = "Disclosure: Some links may be affiliate links. We label commercial relationships clearly and never charge you more.";

/**
 * Affiliate disclosure. Falls back to the site-wide sentence, but prefers the
 * programme-specific text stored on AffiliateProgram.disclosure when a page has one -
 * that column was written by the seed and previously never surfaced anywhere.
 */
export function Disclosure({ programDisclosure }: { programDisclosure?: string | null } = {}) {
  const text = programDisclosure?.trim() || GENERIC;
  return <p className="text-xs leading-5 text-slate-500">{text}</p>;
}
