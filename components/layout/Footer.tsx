import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return <footer className="site-footer mt-32 border-t bg-[#000000] text-white">
    <div className="shell grid gap-16 py-20 md:grid-cols-[1.6fr_1fr_1fr]">
      <div><div className="inline-flex"><Image src="/ttp-footer-logo.webp" alt="Top Tools Pick" width={360} height={72} priority className="h-auto w-[9.5rem] object-contain" /></div><p className="mt-5 max-w-sm text-sm leading-7 text-[#aeb4c2]">A calmer way to find software worth your attention. Independent notes, useful comparisons, no noise.</p></div>
      <div><p className="eyebrow !text-[#2180F8]">Discover</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#cbd0da]"><Link href="/tools" className="hover:text-white">Explore tools</Link><Link href="/categories" className="hover:text-white">Categories</Link><Link href="/best" className="hover:text-white">Best picks</Link></div></div>
      <div><p className="eyebrow !text-[#2180F8]">Read</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#cbd0da]"><Link href="/compare" className="hover:text-white">Comparisons</Link><Link href="/stories" className="hover:text-white">Stories</Link><Link href="/articles" className="hover:text-white">News</Link></div></div>
    </div>
    <div className="shell flex flex-col gap-2 border-t border-[#303541] py-6 text-xs text-[#8991a1] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} TopToolsPick</span><span>Independent discoveries for better digital work.</span></div>
  </footer>;
}
