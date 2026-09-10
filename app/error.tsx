"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="shell py-24 text-center"><p className="eyebrow">Unexpected pause</p><h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">Something went wrong.</h1><p className="mx-auto mt-4 max-w-md text-[#68707d]">Please try again or come back shortly.</p><button onClick={reset} className="button-primary mt-8">Try again</button></section>;
}
