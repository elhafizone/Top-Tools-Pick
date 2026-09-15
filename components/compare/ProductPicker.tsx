"use client";

import { useState } from "react";

type Option = { slug: string; name: string; shortDescription: string };

/**
 * Progressive enhancement only. Without JavaScript this is still a plain GET form:
 * every checkbox works, the submit button is never disabled, and the server re-validates
 * the 2-4 range. The client state exists to stop people picking a fifth tool, to show a
 * live count, and to keep the submit bar honest about what happens next.
 */
export function ProductPicker({ categorySlug, options, initial, min, max }: { categorySlug: string; options: Option[]; initial: string[]; min: number; max: number }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const atLimit = selected.length >= max;
  const ready = selected.length >= min;

  const toggle = (slug: string) =>
    setSelected((current) =>
      current.includes(slug) ? current.filter((value) => value !== slug) : current.length >= max ? current : [...current, slug],
    );

  return (
    <form method="get" action="/compare" className="mt-8">
      <input type="hidden" name="category" value={categorySlug} />
      <fieldset className="border-0 p-0">
        <legend className="sr-only">Choose {min} to {max} tools to compare</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => {
            const checked = selected.includes(option.slug);
            const disabled = !checked && atLimit;
            return (
              <label
                key={option.slug}
                className={`panel flex gap-3.5 p-4 transition ${checked ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "panel-raised"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[var(--accent-line)]"}`}
              >
                <input
                  type="checkbox"
                  name="tools"
                  value={option.slug}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(option.slug)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="min-w-0">
                  <span className="block font-semibold tracking-[-0.01em] text-[var(--ink)]">{option.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{option.shortDescription}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-6">
        <button className="button-primary button-lg">Compare selected</button>
        <p aria-live="polite" className="text-sm text-[var(--muted)]">
          <strong className="font-semibold text-[var(--ink)]">{selected.length}</strong> of {max} selected
          {!ready && ` — pick at least ${min}`}
        </p>
      </div>
    </form>
  );
}
