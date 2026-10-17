"""Third pass: common logo paths on the product's own site, then the Wikidata/Commons logo.
No DB writes. Usage: python scripts/fetch-tool-icons-3.py <items.json> <results.json> --out <dir>
"""
import io, json, re, sys, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import fitz

UA = {"User-Agent": "TopToolsPickIconBot/1.0 (https://toptoolspick.com; icon quality review)"}
out_dir = sys.argv[sys.argv.index("--out") + 1]


def get(url, limit=4_000_000):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
        return r.read(limit), r.headers.get("content-type", ""), r.geturl()


def is_svg(data, url, ctype):
    return url.lower().split("?")[0].endswith(".svg") or "svg" in ctype or data.lstrip()[:5] in (b"<?xml", b"<svg ")


def probe_site(item):
    root = re.match(r"https?://[^/]+", item["websiteUrl"]).group(0)
    paths = ["/logo.svg", "/favicon.svg", "/icon.svg", "/assets/logo.svg", "/images/logo.svg", "/apple-touch-icon.png",
             "/android-chrome-512x512.png", "/android-chrome-192x192.png", "/icon-512.png", "/icon-192.png", "/logo.png", "/favicon-196x196.png"]
    for p in paths:
        try:
            data, ctype, fin = get(root + p)
            if "html" in ctype:
                continue
            if is_svg(data, fin, ctype):
                return data, "svg", root + p
            im = Image.open(io.BytesIO(data))
            if min(im.size) >= 180 and max(im.size) / min(im.size) <= 1.6:
                return data, "png", root + p
        except Exception:
            continue


def wikidata_logo(item):
    q = urllib.parse.quote(item["name"])
    s = json.loads(get(f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={q}&language=en&limit=3&format=json")[0])
    for hit in s.get("search", []):
        ent = json.loads(get(f"https://www.wikidata.org/wiki/Special:EntityData/{hit['id']}.json")[0])["entities"][hit["id"]]
        site = (ent["claims"].get("P856") or [{}])[0].get("mainsnak", {}).get("datavalue", {}).get("value", "")
        host = re.sub(r"^www\.", "", re.sub(r"https?://", "", item["websiteUrl"]).split("/")[0])
        if host.split(".")[0] not in site:
            continue  # make sure it is the same company, not a namesake
        for prop in ("P154", "P8972"):
            claim = ent["claims"].get(prop)
            if claim:
                fname = claim[0]["mainsnak"]["datavalue"]["value"]
                url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(fname) + "?width=512"
                data, ctype, fin = get(url)
                return data, "png", "wikidata:" + fname


def valid(data, kind):
    if kind == "svg":
        pix = fitz.open(stream=data, filetype="svg")[0].get_pixmap(dpi=96, alpha=True)
        im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
    else:
        im = Image.open(io.BytesIO(data)).convert("RGBA")
        if min(im.size) < 180:
            return False
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    px = list(bg.convert("L").getdata())
    return sum(1 for v in px if v < 235) / len(px) >= 0.02


def work(item):
    for fn in (probe_site, wikidata_logo):
        try:
            found = fn(item)
            if found and valid(found[0], found[1]):
                data, kind, src = found
                path = f"{out_dir}/{item['slug']}.{kind}"
                if kind == "png":
                    Image.open(io.BytesIO(data)).convert("RGBA").save(path, optimize=True)
                else:
                    open(path, "wb").write(data)
                return {"slug": item["slug"], "ok": True, "kind": kind, "from": src, "file": path}
        except Exception:
            continue
    return {"slug": item["slug"], "ok": False}


items = json.load(open(sys.argv[1]))
with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(work, items))
json.dump(res, open(sys.argv[2], "w"), indent=1)
ok = [r for r in res if r["ok"]]
print(f"{len(ok)}/{len(res)} fetched; site paths {sum(not r['from'].startswith('wikidata') for r in ok)}, wikidata {sum(r['from'].startswith('wikidata') for r in ok)}")
