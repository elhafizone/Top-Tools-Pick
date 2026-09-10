import Link from "next/link";

export default function NotFound() {
  return <section className="shell py-24 text-center"><p className="eyebrow">404</p><h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">We couldn&apos;t find that page.</h1><p className="mx-auto mt-4 max-w-md text-[#68707d]">The page may have moved, or the link may be out of date.</p><Link href="/" className="button-primary mt-8">Back to TopToolsPick</Link></section>;
}
