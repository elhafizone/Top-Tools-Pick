"""Brand card for social posts: black canvas, tool logo, thin divider, TopToolsPick logo.
Usage: python scripts/make-tool-card.py <slug> <logo-file-or-url>   -> social/cards/<slug>.png (1200x675). X-only; kept out of public/ on purpose.
"""
import io, sys, urllib.request
from PIL import Image, ImageDraw
import fitz  # PyMuPDF, used only to rasterise the SVG site logo

W, H = 1200, 675
slug, src = sys.argv[1], sys.argv[2]

def load(src):
    if src.startswith("http"):
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=30).read()
    else:
        data = open(src, "rb").read()
    if src.lower().split("?")[0].endswith(".svg"):
        pix = fitz.open(stream=data, filetype="svg")[0].get_pixmap(dpi=600, alpha=True)
        return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
    return Image.open(io.BytesIO(data)).convert("RGBA")

def fit(im, box_w, box_h):
    r = min(box_w / im.width, box_h / im.height)
    return im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)

tool = fit(load(src), 220, 220)
site = fit(load("public/ttp-footer-logo.svg"), 420, 120)  # white-on-dark version

canvas = Image.new("RGB", (W, H), (0, 0, 0))
gap, line_w = 70, 2
total = tool.width + gap + line_w + gap + site.width
x = (W - total) // 2
cy = H // 2
canvas.paste(tool, (x, cy - tool.height // 2), tool)
x += tool.width + gap
ImageDraw.Draw(canvas).rectangle([x, cy - 90, x + line_w - 1, cy + 90], fill=(70, 70, 70))
x += line_w + gap
canvas.paste(site, (x, cy - site.height // 2), site)
canvas.save(f"social/cards/{slug}.png", optimize=True)
print("wrote", f"social/cards/{slug}.png", canvas.size)
