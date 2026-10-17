"""Second-pass icon sources for products the site's own <head> did not give a usable icon for.

Order: Simple Icons (official brand vector, coloured with its brand hex) -> the site's
Organization JSON-LD logo -> a logo <img> in the homepage header. No DB writes.

Usage: python scripts/fetch-tool-icons-2.py <items.json> <results.json> --out <dir>
items.json: [{slug, name, websiteUrl}]
"""
import io, json, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urljoin
from PIL import Image
import fitz

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
out_dir = sys.argv[sys.argv.index("--out") + 1]


def get(url, limit=4_000_000):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
        return r.read(limit), r.headers.get("content-type", ""), r.geturl()


SI = json.loads(get("https://cdn.jsdelivr.net/npm/simple-icons@latest/data/simple-icons.json", 5_000_000)[0])
SI_BY = {}
for e in SI:
    slug = e.get("slug") or re.sub(r"[^a-z0-9]", "", e["title"].lower())
    SI_BY[re.sub(r"[^a-z0-9]", "", e["title"].lower())] = (slug, e["hex"])
    SI_BY[slug.replace("-", "")] = (slug, e["hex"])


def simple_icon(item):
    name = re.sub(r"[^a-z0-9]", "", item["name"].lower())
    host = re.match(r"https?://(?:www\.)?([^/.]+)", item["websiteUrl"]).group(1)
    for key in dict.fromkeys([name, name.replace("ai", ""), host]):
        if key in SI_BY:
            slug, hex_ = SI_BY[key]
            svg = get(f"https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/{slug}.svg")[0].decode()
            svg = svg.replace("<svg ", f'<svg fill="#{hex_}" ', 1)
            return svg.encode(), "svg", f"simple-icons:{slug}"
    return None


class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ld, self.imgs, self._ld = [], [], False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and a.get("type") == "application/ld+json":
            self._ld = True
        if tag == "img" and a.get("src") and re.search(r"logo", " ".join(str(a.get(k, "")) for k in ("src", "alt", "class", "id")), re.I):
            self.imgs.append(a["src"])

    def handle_endtag(self, tag):
        if tag == "script":
            self._ld = False

    def handle_data(self, data):
        if self._ld:
            self.ld.append(data)


def logo_from_page(item):
    html, _, final = get(item["websiteUrl"])
    sc = Scan()
    sc.feed(html.decode("utf-8", "ignore"))
    urls = []
    for blob in sc.ld:
        for m in re.finditer(r'"logo"\s*:\s*(?:"([^"]+)"|\{[^}]*?"url"\s*:\s*"([^"]+)")', blob):
            urls.append(urljoin(final, m.group(1) or m.group(2)))
    urls += [urljoin(final, u) for u in sc.imgs[:4]]
    for u in urls:
        try:
            data, ctype, fin = get(u)
            if fin.lower().split("?")[0].endswith(".svg") or "svg" in ctype or data.lstrip()[:5] in (b"<?xml", b"<svg "):
                return data, "svg", u
            im = Image.open(io.BytesIO(data))
            if min(im.size) >= 180 and max(im.size) <= 1500:
                return data, "png", u
        except Exception:
            continue
    return None


def valid(data, kind):
    if kind == "svg":
        pix = fitz.open(stream=data, filetype="svg")[0].get_pixmap(dpi=96, alpha=True)
        im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
    else:
        im = Image.open(io.BytesIO(data)).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    px = list(bg.convert("L").getdata())
    ink = sum(1 for v in px if v < 235) / len(px)
    return ink >= 0.02 and (kind == "svg" or len(im.convert("RGB").resize((64, 64)).getcolors(5000) or []) <= 1500)


def work(item):
    for fn in (simple_icon, logo_from_page):
        try:
            found = fn(item)
            if found and valid(found[0], found[1]):
                data, kind, src = found
                path = f"{out_dir}/{item['slug']}.{'svg' if kind == 'svg' else 'png'}"
                if kind == "png":
                    Image.open(io.BytesIO(data)).convert("RGBA").save(path, optimize=True)
                else:
                    open(path, "wb").write(data)
                return {"slug": item["slug"], "ok": True, "kind": kind, "from": src, "file": path}
        except Exception:
            continue
    return {"slug": item["slug"], "ok": False}


items = json.load(open(sys.argv[1]))
with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(work, items))
json.dump(res, open(sys.argv[2], "w"), indent=1)
ok = [r for r in res if r["ok"]]
print(f"{len(ok)}/{len(res)} fetched; simple-icons {sum(r['from'].startswith('simple-icons') for r in ok)}, page logo {sum(not r['from'].startswith('simple-icons') for r in ok)}")
