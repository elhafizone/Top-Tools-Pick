const SIZES = {
  sm: { field: "field field-sm field-icon", button: "button-primary", icon: "left-3 h-4 w-4" },
  md: { field: "field field-icon", button: "button-primary", icon: "left-3.5 h-[1.05rem] w-[1.05rem]" },
  lg: { field: "field field-lg field-icon", button: "button-primary button-lg", icon: "left-4 h-5 w-5" },
} as const;

type Props = {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  size?: keyof typeof SIZES;
  /** Hidden on the compact header form, where the field alone is the affordance. */
  submitLabel?: string;
  /** Extra query parameters carried into /tools - used to scope a search to a category. */
  scope?: Record<string, string>;
  className?: string;
};

/**
 * Site search.
 *
 * A plain GET form to /tools, so it works without JavaScript and every result page
 * stays server-rendered and crawlable. Four copies of this markup existed - header,
 * hero, closing band, mobile menu - each with its own height, radius and placeholder.
 * Search is the primary way into the site, so it should look identical everywhere it
 * appears and different only in size.
 */
export function SearchForm({ id, label, placeholder, defaultValue, size = "md", submitLabel, scope, className = "" }: Props) {
  const styles = SIZES[size];

  return (
    <form method="get" action="/tools" role="search" className={`flex w-full flex-wrap items-center gap-2.5 ${className}`}>
      {scope && Object.entries(scope).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="relative min-w-0 flex-1">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--muted-soft)] ${styles.icon}`}
        >
          <path
            d="M11 4a7 7 0 1 0 4.19 12.6l3.6 3.6a1 1 0 0 0 1.42-1.42l-3.6-3.6A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
            fill="currentColor"
          />
        </svg>
        <input
          id={id}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className={styles.field}
        />
      </div>
      {submitLabel && <button type="submit" className={styles.button}>{submitLabel}</button>}
    </form>
  );
}
