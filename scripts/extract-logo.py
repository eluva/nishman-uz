"""Извлекает векторный логотип NISHMAN с последней страницы каталога в SVG (белый на прозрачном)."""
import sys
import fitz

PDF = sys.argv[1] if len(sys.argv) > 1 else "assets/brand-catalog.pdf"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/media/brand"


def fmt(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def path_d(drawing, ox, oy):
    parts, cur = [], None
    for it in drawing["items"]:
        kind = it[0]
        if kind == "re":
            r = it[1]
            parts.append(f"M{fmt(r.x0-ox)} {fmt(r.y0-oy)}H{fmt(r.x1-ox)}V{fmt(r.y1-oy)}H{fmt(r.x0-ox)}Z")
            cur = None
            continue
        if kind == "qu":
            q = it[1]
            pts = [q.ul, q.ur, q.lr, q.ll]
            parts.append("M" + "L".join(f"{fmt(p.x-ox)} {fmt(p.y-oy)}" for p in pts) + "Z")
            cur = None
            continue
        start = it[1]
        if cur is None or abs(cur.x - start.x) > 0.01 or abs(cur.y - start.y) > 0.01:
            if parts and cur is not None:
                parts.append("Z")
            parts.append(f"M{fmt(start.x-ox)} {fmt(start.y-oy)}")
        if kind == "l":
            end = it[2]
            parts.append(f"L{fmt(end.x-ox)} {fmt(end.y-oy)}")
        elif kind == "c":
            c1, c2, end = it[2], it[3], it[4]
            parts.append(f"C{fmt(c1.x-ox)} {fmt(c1.y-oy)} {fmt(c2.x-ox)} {fmt(c2.y-oy)} {fmt(end.x-ox)} {fmt(end.y-oy)}")
        cur = end
    parts.append("Z")
    return "".join(parts)


def build(drawings, with_tagline):
    sel = [d for d in drawings if d.get("fill") == (1.0, 1.0, 1.0) and d["rect"].y0 > 600 and d["rect"].y1 < 700]
    if not with_tagline:
        sel = [d for d in sel if d["rect"].y0 > 628]
    x0 = min(d["rect"].x0 for d in sel); y0 = min(d["rect"].y0 for d in sel)
    x1 = max(d["rect"].x1 for d in sel); y1 = max(d["rect"].y1 for d in sel)
    paths = "".join(
        f'<path fill-rule="{"evenodd" if d.get("even_odd") else "nonzero"}" d="{path_d(d, x0, y0)}"/>' for d in sel
    )
    w, h = x1 - x0, y1 - y0
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" fill="#fff" '
        f'role="img" aria-label="NISHMAN">{paths}</svg>'
    )


doc = fitz.open(PDF)
dr = doc[-1].get_drawings()
open(f"{OUT}/nishman-logo.svg", "w", encoding="utf-8").write(build(dr, True))
open(f"{OUT}/nishman-mark.svg", "w", encoding="utf-8").write(build(dr, False))
print("logo ok")
