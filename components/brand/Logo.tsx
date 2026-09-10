import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return <Image src="/ttp-logo.webp" alt="Top Tools Pick" width={192} height={48} priority className={`h-auto w-[9.5rem] object-contain ${className}`} />;
}
