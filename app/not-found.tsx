import Link from "next/link";

export default function NotFound() {
  return <section className="shell py-24 text-center">
    <p className="eyebrow">404</p>
    <h1 className="section-heading mt-3">We couldn&apos;t find that page.</h1>
    <p className="lede mx-auto mt-4 max-w-md">The page may have moved, or the link may be out of date.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href="/tools" className="button-primary">Browse all tools</Link>
      <Link href="/" className="button-secondary">Back to the homepage</Link>
    </div>
  </section>;
}
