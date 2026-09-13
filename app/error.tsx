"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Without this, production failures leave no trace anywhere.
  useEffect(() => { console.error(error); }, [error]);
  return <section className="shell py-24 text-center"><p className="eyebrow">Unexpected pause</p><h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">Something went wrong.</h1><p className="mx-auto mt-4 max-w-md text-[#68707d]">Please try again or come back shortly.</p><button onClick={reset} className="button-primary mt-8">Try again</button>{error.digest && <p className="mt-6 text-xs text-[#8a919c]">Reference: {error.digest}</p>}</section>;
}
