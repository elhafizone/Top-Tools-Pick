"""Fetches the best official icon for products from their own website (no DB writes).

Reads a JSON list of {slug, websiteUrl} and writes public/tool-logos/<slug>.<ext> plus
a results file. Preference: SVG, then the largest square PNG (>= 180px). Anything
smaller, blurry-by-design (.ico) or undecodable is skipped and reported instead.

Usage: python scripts/fetch-tool-icons.py <input.json> <results.json> [--out public/tool-logos]
"""
import io, json, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urljoin
from PIL import Image
import fitz

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
out_dir = "public/tool-logos"
if "--out" in sys.argv:
    out_dir = sys.argv[sys.argv.index("--out") + 1]


def get(url, limit=3_000_000):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read(limit), r.headers.get("content-type", ""), r.geturl()


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        if tag == "link":
            self.items.append(dict(attrs))


def candidates(page_url):
    html, _, final = get(page_url)
    p = Links()
    p.feed(html.decode("utf-8", "ignore"))
    cands = []
    for a in p.items:
        rel = (a.get("rel") or "").lower()
        href = a.get("href")
        if not href:
            continue
        url = urljoin(final, href)
        sizes = a.get("sizes") or ""
        px = max([int(n) for n in re.findall(r"(\d+)x\d+", sizes)] or [0])
        typ = (a.get("type") or "").lower()
        if "apple-touch-icon" in rel:
            cands.append((900 + (px or 180), url))
        elif "icon" in rel and (typ == "image/svg+xml" or url.lower().split("?")[0].endswith(".svg")):
            cands.append((2000, url))
        elif "icon" in rel and px >= 180:
            cands.append((600 + px, url))
        elif rel == "manifest":
            try:
                m = json.loads(get(url)[0])
                for ic in m.get("icons", []):
                    n = max([int(x) for x in re.findall(r"(\d+)x\d+", ic.get("sizes", ""))] or [0])
                    if n >= 180:
                        cands.append((500 + n, urljoin(url, ic["src"])))
            except Exception:
                pass
    return sorted(cands, reverse=True)


def save(slug, url):
    data, ctype, final = get(url)
    is_svg = final.lower().split("?")[0].endswith(".svg") or "svg" in ctype or data.lstrip()[:5] in (b"<?xml", b"<svg ")
    if is_svg:
        pix = fitz.open(stream=data, filetype="svg")[0].get_pixmap(dpi=96, alpha=True)  # decodes = valid
        if pix.width < 8:
            raise ValueError("svg empty")
        path = f"{out_dir}/{slug}.svg"
        open(path, "wb").write(data)
        return path, "svg", max(pix.width, pix.height)
    im = Image.open(io.BytesIO(data))
    if min(im.size) < 180 or max(im.size) / min(im.size) > 1.6:
        raise ValueError(f"low quality or not square: {im.size}")
    path = f"{out_dir}/{slug}.png"
    im.convert("RGBA").save(path, optimize=True)
    return path, "png", min(im.size)


def work(item):
    slug, site = item["slug"], item["websiteUrl"]
    # The product's own page first (it may carry its own mark), then the site root.
    root = re.match(r"https?://[^/]+", site).group(0)
    for page in dict.fromkeys([site, root]):
        try:
            for _, url in candidates(page)[:4]:
                try:
                    path, kind, size = save(slug, url)
                    return {"slug": slug, "ok": True, "kind": kind, "size": size, "from": url, "page": page, "file": path}
                except Exception:
                    continue
        except Exception as e:
            err = str(e)[:80]
    return {"slug": slug, "ok": False}


items = json.load(open(sys.argv[1]))
with ThreadPoolExecutor(8) as ex:
    results = list(ex.map(work, items))
json.dump(results, open(sys.argv[2], "w"), indent=1)
ok = [r for r in results if r["ok"]]
print(f"{len(ok)}/{len(results)} icons fetched; svg {sum(r['kind']=='svg' for r in ok)}, png {sum(r['kind']=='png' for r in ok)}")
