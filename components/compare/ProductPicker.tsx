"use client";

import { useState } from "react";

type Option = { slug: string; name: string; shortDescription: string };

/**
 * Progressive enhancement only. Without JavaScript this is still a plain GET form:
 * every checkbox works, the submit button is never disabled, and the server re-validates
 * the 2-3 range. The client state exists to stop people picking a fourth tool and to
 * show a live count.
 */
export function ProductPicker({ categorySlug, options, initial, min, max }: { categorySlug: string; options: Option[]; initial: string[]; min: number; max: number }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const atLimit = selected.length >= max;

  const toggle = (slug: string) =>
    setSelected((current) =>
      current.includes(slug) ? current.filter((value) => value !== slug) : current.length >= max ? current : [...current, slug],
    );

  return (
    <form method="get" action="/compare" className="mt-10">
      <input type="hidden" name="category" value={categorySlug} />
      <fieldset className="border-0 p-0">
        <legend className="sr-only">Choose {min} to {max} tools to compare</legend>
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => {
            const checked = selected.includes(option.slug);
            return (
              <label key={option.slug} className={`flex cursor-pointer gap-4 bg-white p-5 transition ${checked ? "ring-2 ring-inset ring-[var(--accent)]" : ""} ${!checked && atLimit ? "opacity-45" : ""}`}>
                <input
                  type="checkbox"
                  name="tools"
                  value={option.slug}
                  checked={checked}
                  disabled={!checked && atLimit}
                  onChange={() => toggle(option.slug)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="min-w-0">
                  <span className="block font-bold tracking-[-0.02em]">{option.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{option.shortDescription}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button className="button-primary">Compare selected <span aria-hidden="true">↗</span></button>
        <p aria-live="polite" className="text-sm text-[var(--muted)]">
          {selected.length} of {max} selected{selected.length < min ? ` — pick at least ${min}` : ""}
        </p>
      </div>
    </form>
  );
}
