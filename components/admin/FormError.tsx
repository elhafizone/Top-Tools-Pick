/** Renders the `?error=` message that the admin API redirects back with after a failed form post. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="mt-4 max-w-2xl border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{message}</p>;
}
