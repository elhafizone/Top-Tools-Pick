"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Result = {
  slug: string;
  name: string;
  logoUrl: string | null;
  shortDescription: string | null;
  category: { name: string };
};

type Props = {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  size?: "sm" | "md" | "lg";
  submitLabel?: string;
  scope?: Record<string, string>;
  className?: string;
};

const SIZES = {
  sm: { field: "field field-sm field-icon", button: "button-primary", icon: "left-3 h-4 w-4" },
  md: { field: "field field-icon", button: "button-primary", icon: "left-3.5 h-[1.05rem] w-[1.05rem]" },
  lg: { field: "field field-lg field-icon", button: "button-primary button-lg", icon: "left-4 h-5 w-5" },
} as const;

export function SearchAutocomplete({
  id,
  label,
  placeholder,
  defaultValue = "",
  size = "md",
  submitLabel,
  scope,
  className = "",
}: Props) {
  const styles = SIZES[size];
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 3) { setResults([]); setOpen(false); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: Result[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setActive(-1);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchResults(value), 200);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [value, fetchResults]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const commit = (slug?: string) => {
    setOpen(false);
    if (slug) {
      router.push(`/tools/${slug}`);
    } else {
      const params = new URLSearchParams(scope);
      if (value.trim()) params.set("q", value.trim());
      router.push(`/tools?${params.toString()}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    if (e.key === "Enter") { e.preventDefault(); active >= 0 ? commit(results[active].slug) : commit(); }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative flex w-full flex-wrap items-center gap-2.5 ${className}`}>
      {scope && Object.entries(scope).map(([name, val]) => <input key={name} type="hidden" name={name} value={val} />)}
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="relative min-w-0 flex-1">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--muted-soft)] ${styles.icon}`}>
          <path d="M11 4a7 7 0 1 0 4.19 12.6l3.6 3.6a1 1 0 0 0 1.42-1.42l-3.6-3.6A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" fill="currentColor" />
        </svg>
        <input
          id={id}
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={open ? `${id}-results` : undefined}
          aria-activedescendant={active >= 0 ? `${id}-result-${active}` : undefined}
          className={styles.field}
        />

        {open && (
          <ul
            id={`${id}-results`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-[var(--radius-surface)] border border-[var(--line)] bg-[var(--surface)] shadow-lg"
          >
            {results.map((r, i) => (
              <li
                key={r.slug}
                id={`${id}-result-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => { e.preventDefault(); commit(r.slug); }}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-[var(--surface-raised)] ${i === active ? "bg-[var(--surface-raised)]" : ""}`}
              >
                {r.logoUrl ? (
                  <Image src={r.logoUrl} alt="" width={24} height={24} className="h-6 w-6 shrink-0 rounded object-contain" />
                ) : (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--line)] text-xs font-bold text-[var(--muted)]">{r.name[0]}</span>
                )}
                <span className="min-w-0">
                  <span className="block font-semibold text-[var(--ink)]">{r.name}</span>
                  <span className="block truncate text-xs text-[var(--muted)]">{r.category.name}</span>
                </span>
              </li>
            ))}
            <li
              onMouseDown={(e) => { e.preventDefault(); commit(); }}
              className="border-t border-[var(--line)] px-4 py-2.5 text-sm text-[var(--accent-deep)] hover:bg-[var(--surface-raised)] cursor-pointer"
            >
              Search all tools for &ldquo;{value}&rdquo; →
            </li>
          </ul>
        )}
      </div>
      {submitLabel && (
        <button type="button" onClick={() => commit()} className={styles.button}>
          {submitLabel}
        </button>
      )}
    </div>
  );
}
