import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * The visible breadcrumb trail. Six pages each hand-wrote this markup with their own
 * separators and hover colours; the JSON-LD counterpart already lived in one place
 * (`breadcrumbJsonLd`), so this is the missing visual half of the same idea.
 *
 * The last crumb is the current page and is never a link.
 */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-x-2">
              {item.href && !isLast
                ? <Link href={item.href} className="hover:text-[var(--ink)]">{item.name}</Link>
                : <span className={isLast ? "font-medium text-[var(--ink)]" : undefined} aria-current={isLast ? "page" : undefined}>{item.name}</span>}
              {!isLast && <span aria-hidden="true" className="text-[var(--muted-soft)]">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
