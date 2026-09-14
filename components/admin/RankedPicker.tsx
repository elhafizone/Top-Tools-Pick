"use client";

import { useState } from "react";

type Option = { id: string; name: string; hint?: string };
export type RankedRow = { id: string; text: string; extra?: string };

type Props = {
  /** Admin API endpoint that accepts { items: [...] } as a replace-all POST. */
  endpoint: string;
  options: Option[];
  initial: RankedRow[];
  /** Field name the endpoint expects for the referenced record id. */
  idField: "alternativeId" | "productId";
  /** Field name for the free-text column ("reason" for alternatives, "note" for articles). */
  textField: "reason" | "note" | "rationale";
  textLabel: string;
  addLabel: string;
  emptyHint: string;
  /** Optional second field, e.g. the award slot on an editorial list item. */
  extraSelect?: { field: string; label: string; options: readonly string[]; hint?: string };
};

/**
 * Add / remove / reorder rows, then POST the whole list.
 *
 * Shared by curated alternatives and article-to-tool links. Rank is derived from
 * array position on submit, so editors never type rank numbers by hand and the
 * "ranks must be unique" validation on the server can't be tripped accidentally.
 */
export function RankedPicker({ endpoint, options, initial, idField, textField, textLabel, addLabel, emptyHint, extraSelect }: Props) {
  const [rows, setRows] = useState<RankedRow[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const chosen = new Set(rows.map((row) => row.id));
  const available = options.filter((option) => !chosen.has(option.id));

  const dirty = () => { setSaved(false); setError(null); };

  function add(id: string) {
    if (!id || chosen.has(id)) return;
    setRows((current) => [...current, { id, text: "" }]);
    dirty();
  }

  function remove(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
    dirty();
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    dirty();
  }

  function setText(id: string, text: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, text } : row)));
    dirty();
  }

  function setExtra(id: string, extra: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, extra } : row)));
    dirty();
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          items: rows.map((row, index) => ({
            [idField]: row.id,
            rank: index + 1,
            [textField]: row.text,
            ...(extraSelect ? { [extraSelect.field]: row.extra ?? "" } : {}),
          })),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(typeof result?.error === "string" ? result.error : "Unable to save.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const nameOf = (id: string) => options.find((option) => option.id === id)?.name ?? id;

  return (
    <div className="mt-4 max-w-3xl">
      {rows.length === 0 ? (
        <p className="border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-600">{emptyHint}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.id} className="border border-slate-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold">{index + 1}. {nameOf(row.id)}</span>
                <span className="flex gap-2">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="border border-slate-300 px-2 py-1 text-xs disabled:opacity-40" aria-label={`Move ${nameOf(row.id)} up`}>↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} className="border border-slate-300 px-2 py-1 text-xs disabled:opacity-40" aria-label={`Move ${nameOf(row.id)} down`}>↓</button>
                  <button type="button" onClick={() => remove(row.id)} className="border border-red-300 px-2 py-1 text-xs text-red-700" aria-label={`Remove ${nameOf(row.id)}`}>Remove</button>
                </span>
              </div>
              <label className="mt-3 block text-xs font-semibold text-slate-700">
                {textLabel}
                <input
                  value={row.text}
                  onChange={(event) => setText(row.id, event.target.value)}
                  className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
              {extraSelect && (
                <label className="mt-3 block text-xs font-semibold text-slate-700">
                  {extraSelect.label}
                  <select
                    value={row.extra ?? ""}
                    onChange={(event) => setExtra(row.id, event.target.value)}
                    className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal"
                  >
                    <option value="">— no award —</option>
                    {extraSelect.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  {extraSelect.hint && <span className="mt-1 block text-xs font-normal text-slate-500">{extraSelect.hint}</span>}
                </label>
              )}
            </li>
          ))}
        </ol>
      )}

      {available.length > 0 && (
        <label className="mt-4 block text-sm font-semibold">
          {addLabel}
          <select
            value=""
            onChange={(event) => { add(event.target.value); event.target.value = ""; }}
            className="mt-2 block w-full border border-slate-300 px-3 py-2"
          >
            <option value="">Select a tool…</option>
            {available.map((option) => (
              <option key={option.id} value={option.id}>{option.name}{option.hint ? ` — ${option.hint}` : ""}</option>
            ))}
          </select>
        </label>
      )}

      {error && <p role="alert" className="mt-4 border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
      {saved && <p role="status" className="mt-4 border-l-4 border-green-700 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">Saved.</p>}

      <button type="button" onClick={save} disabled={saving} className="mt-4 w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? "Saving…" : "Save order"}
      </button>
    </div>
  );
}
