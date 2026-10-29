"""
Собирает каталог из PDF и студийных фото (img/):
  * public/media/products/<id>.webp     — фото товаров: студийное фото без белого фона (catalog_spec.STUDIO)
                                          или композиция вшитых изображений ячейки PDF; <id>-N.webp — галерея
  * public/media/models/<name>.webp      — лайфстайл-фото (каждое используется на сайте один раз)
  * data/products.json, data/lines.json  — данные каталога
  * messages/catalog/{ru,uz,en}.json     — тексты каталога (типы, ароматы, свойства и т. д.)

Запуск из корня проекта:  python -I scripts/build-catalog.py [assets/brand-catalog.pdf] [hero-src-dir]
Требуется: pymupdf, pillow, numpy, scipy.
"""
import io
import json
import os
import sys

import fitz
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from scipy.spatial import ConvexHull

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from catalog_spec import (  # noqa: E402
    CATEGORIES, DEFAULT_GRID, GRIDS, LINES, PDF_MAIN, PHOTO_DIR, PHOTO_PREFIX, PHOTOS, PRODUCTS, SHADE_PHOTOS, STUDIO,
)
from catalog_texts import (  # noqa: E402
    ALIASES, FEATURES, LINE_FEATURES, LINE_NAME_KEYS, LINE_NOTES, NOTES, PRODUCT_FEATURES,
    SCENTS, SHADES, TYPES, VARIANTS,
)

PDF = sys.argv[1] if len(sys.argv) > 1 else "assets/brand-catalog.pdf"
HERO_SRC = sys.argv[2] if len(sys.argv) > 2 else None
ROOT = os.getcwd()
OUT_PRODUCTS = os.path.join(ROOT, "public", "media", "products")
OUT_MODELS = os.path.join(ROOT, "public", "media", "models")
for d in (OUT_PRODUCTS, OUT_MODELS, os.path.join(ROOT, "data"), os.path.join(ROOT, "messages", "catalog")):
    os.makedirs(d, exist_ok=True)
# фото товаров пересобираются целиком — без «осиротевших» файлов от прошлых сборок
for f in os.listdir(OUT_PRODUCTS):
    if f.endswith(".webp"):
        os.remove(os.path.join(OUT_PRODUCTS, f))

doc = fitz.open(PDF)
PAGE_W, PAGE_H = 1191.0, 842.0


# ---------------------------------------------------------------- helpers -----
def load_image(xref):
    """Pixmap -> PIL RGBA (маска SMask масштабируется, если её размер отличается)."""
    base = doc.extract_image(xref)
    pix = fitz.Pixmap(doc, xref)
    if pix.alpha:
        pix = fitz.Pixmap(pix, 0)
    if pix.colorspace is None or pix.colorspace.n != 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    smask = base.get("smask", 0)
    if smask:
        m = fitz.Pixmap(doc, smask)
        mask = Image.frombytes("L", (m.width, m.height), m.samples) if m.n == 1 else Image.open(io.BytesIO(m.tobytes())).convert("L")
        if mask.size != img.size:
            mask = mask.resize(img.size, Image.LANCZOS)
        img = img.convert("RGBA")
        img.putalpha(mask)
        return img, True
    return img.convert("RGBA"), False


def key_out_white(img, thresh=22):
    """Удаляет белый фон, связанный с краями (заливка от границы)."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    sentinel = (255, 0, 254)
    step = max(4, min(w, h) // 40)
    pts = [(x, 0) for x in range(0, w, step)] + [(x, h - 1) for x in range(0, w, step)]
    pts += [(0, y) for y in range(0, h, step)] + [(w - 1, y) for y in range(0, h, step)]
    for p in pts:
        r, g, b = rgb.getpixel(p)
        if min(r, g, b) > 255 - thresh and rgb.getpixel(p) != sentinel:
            ImageDraw.floodfill(rgb, p, sentinel, thresh=thresh)
    arr = np.array(rgb)
    bg = (arr[:, :, 0] == 255) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 254)
    alpha = np.where(bg, 0, 255).astype("uint8")
    a = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.8))
    out = img.convert("RGBA")
    out.putalpha(a)
    return out


INFO_CACHE = {}


def page_images(pno):
    if pno not in INFO_CACHE:
        page = doc[pno - 1]
        INFO_CACHE[pno] = [i for i in page.get_image_info(xrefs=True) if i["xref"]]
    return INFO_CACHE[pno]


def cell_rect(pno, col, row):
    cols, rows = GRIDS.get(pno, DEFAULT_GRID)
    cw, rh = PAGE_W / cols, PAGE_H / rows
    return fitz.Rect(col * cw, row * rh, (col + 1) * cw, (row + 1) * rh)


def cell_images(pno, col, row):
    rect = cell_rect(pno, col, row)
    out = []
    for inf in page_images(pno):
        b = fitz.Rect(inf["bbox"])
        cx, cy = (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2
        if not rect.contains(fitz.Point(cx, cy)):
            continue
        if b.width * b.height > 0.72 * rect.width * rect.height:
            continue  # это фото на всю ячейку, не товар
        out.append(inf)
    return out


def composite(infos, max_side=900):
    union = fitz.Rect(infos[0]["bbox"])
    for inf in infos[1:]:
        union |= fitz.Rect(inf["bbox"])
    scale = min(3.2, max(inf["width"] / max(1, fitz.Rect(inf["bbox"]).width) for inf in infos))
    W, H = int(union.width * scale) + 2, int(union.height * scale) + 2
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for inf in infos:
        img, has_alpha = load_image(inf["xref"])
        if not has_alpha:
            img = key_out_white(img)
        b = fitz.Rect(inf["bbox"])
        tw, th = max(1, int(b.width * scale)), max(1, int(b.height * scale))
        img = img.resize((tw, th), Image.LANCZOS)
        canvas.alpha_composite(img, (int((b.x0 - union.x0) * scale), int((b.y0 - union.y0) * scale)))
    bbox = canvas.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if bbox:
        canvas = canvas.crop(bbox)
    canvas.thumbnail((max_side, max_side), Image.LANCZOS)
    pad = int(max(canvas.size) * 0.04)
    framed = Image.new("RGBA", (canvas.width + pad * 2, canvas.height + pad * 2), (0, 0, 0, 0))
    framed.alpha_composite(canvas, (pad, pad))
    return framed


# ---------------------------------------------------------- studio photos ----
BG = 6        # чистый студийный фон: 255 - min(R,G,B) <= BG
DARK = 60     # «тёмная масса» товара: крышки, этикетки, текст
SHADOW = 40   # цвет тени при разложении «тёмная тень поверх белого»


def caption_row(rgb, d, dark, h):
    """Подпись под товаром («150 мл», «20 г»): отдельная полоса серого текста внизу кадра -> первая строка полосы."""
    ys = np.where(dark.any(axis=1))[0]
    if not len(ys):
        return None
    gaps = np.where(np.diff(ys) > 4)[0]
    if not len(gaps):
        return None
    cut = ys[gaps[-1] + 1]
    if cut < h * 0.6 or ys[-1] - cut > h * 0.13:
        return None
    band = rgb[cut:][dark[cut:]]
    if np.median(band.max(axis=1) - band.min(axis=1)) > 25:  # подпись — нейтрально-серая, не цветной край товара
        return None
    ys, xs = np.nonzero(dark[cut:])
    box = d[cut:][ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    if (box <= BG).mean() < 0.1:  # между буквами подписи — чистый фон; у низа флакона с текстом — нет
        return None
    return cut - 2


def hull_mask(mask):
    """Выпуклые оболочки крупных тёмных компонент: внутри — товар целиком, включая белые части."""
    h, w = mask.shape
    out = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(out)
    lab, n = ndimage.label(ndimage.binary_closing(mask, iterations=4))
    if n:
        sizes = ndimage.sum(np.ones(mask.shape), lab, range(1, n + 1))
        for i, size in enumerate(sizes, 1):
            if size < max(400, sizes.max() * 0.01):
                continue
            ys, xs = np.nonzero(lab == i)
            pts = np.column_stack([xs, ys])
            hull = ConvexHull(pts)
            draw.polygon([tuple(map(int, pt)) for pt in pts[hull.vertices]], fill=255)
    return ndimage.binary_dilation(np.asarray(out) > 0, iterations=2)


def studio_cutout(path, max_side=900):
    """Студийное фото на белом -> RGBA: фон прозрачный, тень полупрозрачная, подпись с объёмом удалена."""
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h = rgb.shape[0]
    d = 255 - rgb.min(axis=2)
    dark = d >= DARK
    cap = caption_row(rgb, d, dark, h)
    if cap is not None:
        dark[cap:] = False
    lab, _ = ndimage.label(d <= BG)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bg = np.isin(lab, edge[edge > 0])
    body = hull_mask(dark)
    alpha = np.where(body & ~bg, 1.0, 0.0)
    shade = ~body & ~bg
    alpha[shade] = np.clip(d[shade] / (255 - SHADOW), 0, 1)
    if cap is not None:
        alpha[cap:][~body[cap:]] = 0
    rgb[shade] = SHADOW
    img = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")
    img = img.crop(img.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox())
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    pad = int(max(img.size) * 0.04)
    framed = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    framed.alpha_composite(img, (pad, pad))
    return framed


def studio_path(key):
    return os.path.join(ROOT, PHOTO_DIR, f"{PHOTO_PREFIX}{key}.jpg")


def save_webp(img, path, quality=84):
    img.save(path, "WEBP", quality=quality, method=6)
    return img.size


# ---------------------------------------------------------------- products ----
line_by_id = {l[0]: l for l in LINES}
category_index = {c[0]: c[1] for c in CATEGORIES}
products_out, sizes = [], {}

for pid, code, line, ptype, name, extra in PRODUCTS:
    assert line in line_by_id, f"unknown line {line}"
    assert ptype in TYPES, f"unknown type {ptype}"
    studio = STUDIO.get(pid, [])
    images = []

    def add_image(img):
        n = len(images) + 1
        fname = f"{pid}.webp" if n == 1 else f"{pid}-{n}.webp"
        w, h = save_webp(img, os.path.join(OUT_PRODUCTS, fname))
        images.append({"src": f"/media/products/{fname}", "width": w, "height": h})
        return images[-1]

    page = None
    if "src" in extra and (not studio or pid in PDF_MAIN):
        page, col, row = extra["src"]
        infos = cell_images(page, col, row)
        assert infos, f"no images for {pid} at {extra['src']}"
        add_image(composite(infos))
        if not studio:
            for (p2, c2, r2) in extra.get("extraSrc", []):
                add_image(composite(cell_images(p2, c2, r2)))
    assert images or studio, f"no photo for {pid}"
    for key in studio:
        add_image(studio_cutout(studio_path(key)))
    shade_images = []
    for shade, key in SHADE_PHOTOS.get(pid, {}).items():
        assert shade in extra.get("shades", []), f"{pid}: shade photo for unknown shade {shade}"
        shade_images.append({"shade": shade, **add_image(studio_cutout(studio_path(key)))})

    features = PRODUCT_FEATURES.get(pid, LINE_FEATURES.get(line, []))
    features = [ALIASES.get(f, f) for f in features]
    for f in features:
        assert f in FEATURES or f in NOTES, f"unknown feature {f} ({pid})"
    scent = extra.get("scent")
    variant = extra.get("variant")
    if scent:
        assert scent in SCENTS, scent
    if variant:
        assert variant in VARIANTS or variant in SHADES, variant
    for s in extra.get("shades", []):
        assert s in SHADES, s

    volumes = [
        {"value": val, "unit": unit, "price": price, "demo": True}
        for (val, unit, price) in extra["volumes"]
    ]
    category = line_by_id[line][1]
    products_out.append({
        "id": pid,
        "code": code,
        "line": line,
        "category": category,
        "type": ptype,
        "name": name,
        "scent": scent,
        "variant": variant,
        "volumes": volumes,
        "effect": extra.get("effect"),
        "hold": extra.get("hold"),
        "holdPlus": bool(extra.get("holdPlus", False)),
        "features": features,
        "notes": LINE_NOTES.get(line, []),
        "forSalons": extra.get("forSalons", []),
        "size": extra.get("size"),
        "shades": extra.get("shades", []),
        "swatch": extra.get("swatch"),
        "image": images[0],
        "gallery": images[1:] + [{"photo": g} for g in extra.get("gallery", [])],
        "shadeImages": shade_images,
        "source": {"pdfPage": page} if page else {"photos": [f"{PHOTO_PREFIX}{k}.jpg" for k in studio]},
    })
    print(f"{pid:28s} {len(images)} img -> {images[0]['width']}x{images[0]['height']}")

# ---------------------------------------------------------------- photos ------
photo_meta = {}
for xref, meta in PHOTOS.items():
    if meta is None:
        continue
    name, usage = meta
    img, _ = load_image(xref)
    img = img.convert("RGB")
    if HERO_SRC and usage == "hero":
        os.makedirs(HERO_SRC, exist_ok=True)
        img.save(os.path.join(HERO_SRC, f"{name}.png"))
    img.thumbnail((1800, 1800), Image.LANCZOS)
    save_webp(img, os.path.join(OUT_MODELS, f"{name}.webp"), quality=80)
    photo_meta[name] = {"src": f"/media/models/{name}.webp", "width": img.width, "height": img.height, "usage": usage}
    print(f"photo {name:24s} {img.width}x{img.height}")

# Галереи: ссылка на фото -> объект изображения
for p in products_out:
    gal = []
    for g in p["gallery"]:
        if "photo" in g:
            m = photo_meta[g["photo"]]
            gal.append({"src": m["src"], "width": m["width"], "height": m["height"]})
        else:
            gal.append(g)
    p["gallery"] = gal

# ---------------------------------------------------------------- JSON -------
lines_out = []
for lid, cat, lname in LINES:
    members = [p for p in products_out if p["line"] == lid]
    lines_out.append({
        "id": lid,
        "category": cat,
        "name": lname,
        "nameKey": lid if lname is None else None,
        "features": LINE_FEATURES.get(lid, []),
        "notes": LINE_NOTES.get(lid, []),
        "count": len(members),
    })

with open(os.path.join(ROOT, "data", "products.json"), "w", encoding="utf-8") as f:
    json.dump(products_out, f, ensure_ascii=False, indent=1)
with open(os.path.join(ROOT, "data", "lines.json"), "w", encoding="utf-8") as f:
    json.dump(lines_out, f, ensure_ascii=False, indent=1)
with open(os.path.join(ROOT, "data", "categories.json"), "w", encoding="utf-8") as f:
    json.dump([{"id": c, "number": n} for c, n in CATEGORIES], f, ensure_ascii=False, indent=1)
with open(os.path.join(ROOT, "data", "photos.json"), "w", encoding="utf-8") as f:
    json.dump(photo_meta, f, ensure_ascii=False, indent=1)

for li, loc in enumerate(["ru", "uz", "en"]):
    def pick(d):
        return {k: v[li] for k, v in d.items()}
    msgs = {
        "types": pick(TYPES),
        "scents": pick(SCENTS),
        "variants": pick(VARIANTS),
        "shades": pick(SHADES),
        "notes": pick(NOTES),
        "features": pick(FEATURES),
        "lineNames": {k.replace("-", "_"): v[li] for k, v in LINE_NAME_KEYS.items()},
    }
    with open(os.path.join(ROOT, "messages", "catalog", f"{loc}.json"), "w", encoding="utf-8") as f:
        json.dump(msgs, f, ensure_ascii=False, indent=1)

sku = sum(max(1, len(p["shades"])) * len(p["volumes"]) for p in products_out)
print(f"\nproducts: {len(products_out)}  lines: {len(lines_out)}  SKU (product x volume x shade): {sku}")
