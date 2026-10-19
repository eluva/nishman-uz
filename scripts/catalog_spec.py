"""
Спецификация каталога NISHMAN, собранная вручную по PDF (assets/brand-catalog.pdf).

Все названия, коды, объёмы, фиксация (по точкам «Фиксация») и свойства взяты из PDF,
опечатки исправлены (см. README → «Исправления текста PDF»).
Цены — ДЕМО (demo: true), их нужно заменить реальными.

Формат товара:
  id, code, line, type (ключ типа), name (бренд-название, не переводится) | None,
  scent/variant (ключ), volumes [(value, unit, price)], effect, hold, holdPlus,
  features (ключи), notes (ключи пилюль), forSalons, size, shades (ключи),
  src: (page, col, row) — ячейка сетки разворота, откуда собирается фото товара.
"""

# --- Сетки разворотов: (cols, rows) ---------------------------------------------
GRIDS = {4: (4, 4), 6: (4, 4), 26: (4, 4), 27: (4, 4), 19: (6, 3)}
DEFAULT_GRID = (4, 3)

# --- Категории (карта каталога, 01–07) ------------------------------------------
CATEGORIES = [
    ("styling", "01"),
    ("care", "02"),
    ("color", "03"),
    ("shaving", "04"),
    ("beard", "05"),
    ("face", "06"),
    ("accessories", "07"),
]

# --- Линейки ------------------------------------------------------------------------
# id, category, name (не переводится; None -> переводимое имя из LINE_NAME_KEYS)
LINES = [
    ("aqua-wax", "styling", "Aqua Hair Styling Wax"),
    ("coloring-wax", "styling", "Coloring Wax"),
    ("spider-wax", "styling", "Aqua Spider Wax"),
    ("matte", "styling", "Hair Styling Matte"),
    ("pomade", "styling", "Styling Cream Pomade"),
    ("styling-cream", "styling", "Styling Cream"),
    ("seasalt", "styling", "Seasalt Spray"),
    ("powder", "styling", "Powder Styling"),
    ("gel", "styling", "Hair Styling Gel"),
    ("ultra-hold", "styling", "Ultra Hold"),
    ("styling-tonic", "styling", "Styling Tonic"),
    ("styling-spray", "styling", "Styling Spray"),
    ("color-spray", "color", "Hair Spray"),
    ("root-concealer", "color", "Hair Magic Retouch"),
    ("keratin-fiber", "color", "Keratin Fiber"),
    ("two-phase", "care", "Beard & Hair"),
    ("hair-tonic", "care", "Hair Tonic"),
    ("hair-mask", "care", "Inca Inchi Complex"),
    ("pro-shampoo", "care", "Professional Hair Shampoo"),
    ("pro-conditioner", "care", "Professional Hair Conditioner"),
    ("salon-size", "care", "Salon Size"),
    ("shaving-gel", "shaving", "Shaving Gel"),
    ("cream-cologne", "shaving", "Cream & Cologne"),
    ("cologne", "shaving", "Cologne"),
    ("after-shave-lotion", "shaving", "After Shave Lotion"),
    ("talc", "shaving", "Talc Powder"),
    ("beard-oil", "beard", "Beard & Mustache"),
    ("beard-wash", "beard", "Beard & Mustache Care"),
    ("beard-balm", "beard", "Styling Balm"),
    ("beard-perfume", "beard", "Perfumed Spray"),
    ("peel-off", "face", "Peel-Off Mask"),
    ("skin-smoothing", "face", "Skin Smoothing"),
    ("facial-scrub", "face", "Facial Scrub"),
    ("clay-mask", "face", "Face Clay Mask"),
    ("hand-face", "face", "Hand & Face Cream"),
    ("hair-comb", "accessories", "Hair Comb"),
    ("hair-brush", "accessories", "Hair Brush"),
    ("fade-brush", "accessories", "Fade Brush"),
    ("neck-brush", "accessories", "Neck Brush"),
    ("barber-essentials", "accessories", None),
]

# --- Демо-цены (UZS) ----------------------------------------------------------------
P = {
    "aqua": {30: 35000, 100: 79000, 150: 95000},
    "colorwax": {100: 89000},
    "spider": {30: 39000, 100: 85000, 150: 99000},
    "matte": {30: 45000, 100: 109000},
    "pomade": {100: 99000},
    "scream": {30: 35000, 100: 79000, 150: 92000},
}


def v(*pairs, unit="ml"):
    """[(value, price)] -> volumes"""
    return [(val, unit, price) for val, price in pairs]


def vt(table, *vals, unit="ml"):
    return [(val, unit, table[val]) for val in vals]


PCS = "pcs"

# --- Товары ---------------------------------------------------------------------------
# (id, code, line, type, name, extra-dict)
PRODUCTS = [
    # ===== 01 СТАЙЛИНГ =====================================================================
    # Aqua Hair Styling Wax — «Естественный блеск», 30·100·150, Фиксация ●●●●○
    ("aqua-wax-01", "01", "aqua-wax", "aquaWax", "GUMGUM", dict(scent="bubblegum", volumes=vt(P["aqua"], 30, 100, 150), effect="natural-shine", hold=4, src=(4, 2, 0), swatch="#2563c9")),
    ("aqua-wax-02", "02", "aqua-wax", "aquaWax", "SPORT", dict(scent="tropicalFruits", volumes=vt(P["aqua"], 100, 150), effect="natural-shine", hold=4, src=(4, 3, 0), swatch="#f25a1f")),
    ("aqua-wax-03", "03", "aqua-wax", "aquaWax", "FLAMING", dict(scent="mango", volumes=vt(P["aqua"], 30, 100, 150), effect="natural-shine", hold=4, src=(4, 2, 1), swatch="#d4202a")),
    ("aqua-wax-04", "04", "aqua-wax", "aquaWax", "RUGBY", dict(scent="orientalFlowers", volumes=vt(P["aqua"], 30, 100, 150), effect="natural-shine", hold=4, src=(4, 2, 2), swatch="#7b2fa8")),
    ("aqua-wax-05", "05", "aqua-wax", "aquaWax", "KERATIN", dict(scent="forestBerries", volumes=vt(P["aqua"], 100, 150), effect="natural-shine", hold=4, src=(4, 3, 2), swatch="#5fc54a")),
    ("aqua-wax-06", "06", "aqua-wax", "aquaWax", "MYSTIC GUMMY", dict(scent="peach", volumes=vt(P["aqua"], 100, 150), effect="natural-shine", hold=4, src=(4, 2, 3), swatch="#e9e6e1")),
    ("aqua-wax-07", "07", "aqua-wax", "aquaWax", "GOLD ONE", dict(scent="oneMillion", volumes=vt(P["aqua"], 30, 100, 150), effect="natural-shine", hold=4, src=(4, 3, 3), swatch="#c9a24a")),
    ("aqua-wax-08", "08", "aqua-wax", "aquaWax", "MATTE", dict(scent="blackVanilla", volumes=vt(P["aqua"], 100, 150), effect="matte", hold=4, src=(5, 0, 0))),
    ("aqua-wax-09", "09", "aqua-wax", "aquaWax", "SPORT", dict(scent="cola", volumes=vt(P["aqua"], 100, 150), effect="natural-shine", hold=4, src=(5, 1, 0))),
    # Coloring Wax — «Полуматовый эффект», 100 ml, «Без фиксации»
    ("coloring-wax-c1", "C1", "coloring-wax", "coloringWax", "LIGHT SILVER", dict(variant="lightSilver", volumes=vt(P["colorwax"], 100), effect="semi-matte", hold=0, src=(5, 2, 0), gallery=["coloring-wax-palm"])),
    ("coloring-wax-c2", "C2", "coloring-wax", "coloringWax", "GREY SMOKED", dict(variant="ash", volumes=vt(P["colorwax"], 100), effect="semi-matte", hold=0, src=(5, 2, 1))),
    ("coloring-wax-c3", "C3", "coloring-wax", "coloringWax", "DARK BLACK", dict(variant="deepBlack", volumes=vt(P["colorwax"], 100), effect="semi-matte", hold=0, src=(5, 2, 2))),
    # Aqua Spider Wax — «Естественный блеск», Фиксация ●●●○○
    ("spider-wax-s1", "S1", "spider-wax", "spiderWax", "BLACK WIDOW", dict(volumes=vt(P["spider"], 100, 150), effect="natural-shine", hold=3, src=(6, 0, 0))),
    ("spider-wax-s2", "S2", "spider-wax", "spiderWax", "TARANTULA", dict(volumes=vt(P["spider"], 100, 150), effect="natural-shine", hold=3, src=(6, 1, 0))),
    ("spider-wax-s3", "S3", "spider-wax", "spiderWax", "BLUE WEB", dict(volumes=vt(P["spider"], 100, 150), effect="natural-shine", hold=3, src=(6, 1, 1))),
    ("spider-wax-s4", "S4", "spider-wax", "spiderWax", "ARGAN", dict(volumes=vt(P["spider"], 150), effect="natural-shine", hold=3, src=(6, 1, 2))),
    ("spider-wax-s5", "S5", "spider-wax", "spiderWax", "KERATIN", dict(volumes=vt(P["spider"], 150), effect="natural-shine", hold=3, src=(6, 0, 3))),
    ("spider-wax-s6", "S6", "spider-wax", "spiderWax", "KERATIN", dict(volumes=vt(P["spider"], 30, 150), effect="natural-shine", hold=3, src=(6, 1, 3))),
    # Hair Styling Matte — «Матовый эффект», 30·100
    ("matte-m1", "M1", "matte", "mattePaste", "ARGAN", dict(volumes=vt(P["matte"], 30, 100), effect="matte", hold=5, src=(7, 1, 0))),
    ("matte-m2", "M2", "matte", "mattePaste", "ARGAN", dict(volumes=vt(P["matte"], 30, 100), effect="matte", hold=5, src=(7, 0, 1))),
    ("matte-m3", "M3", "matte", "mattePaste", "TEXTURIZING MESS UP", dict(volumes=vt(P["matte"], 30, 100), effect="matte", hold=4, src=(7, 1, 2), gallery=["matte-m3-hands"])),
    ("matte-m4", "M4", "matte", "classicClay", "SUPER HIGH HOLD", dict(volumes=vt(P["matte"], 30, 100), effect="matte", hold=5, src=(7, 3, 0), gallery=["matte-m4-hands"])),
    ("matte-m5", "M5", "matte", "mattePaste", None, dict(scent="sweetVanilla", volumes=vt(P["matte"], 30, 100), effect="matte", hold=4, src=(7, 2, 1), gallery=["matte-m5-hands"])),
    ("matte-m6", "M6", "matte", "matteWax", "INCA INCHI", dict(volumes=vt(P["matte"], 30, 100), effect="matte", hold=4, src=(7, 3, 2))),
    ("matte-m7", "M7", "matte", "mattePaste", "FLEXIBLE FIXING", dict(volumes=vt(P["matte"], 100), effect="matte", hold=3, src=(8, 1, 0), gallery=["matte-m7-hands"])),
    ("matte-m8", "M8", "matte", "stylingCreamM8", "NATURAL SHINE", dict(volumes=vt(P["matte"], 100), effect="natural-shine", hold=3, src=(8, 0, 1))),
    ("matte-m9", "M9", "matte", "mattePaste", "STRONG FIXING", dict(volumes=vt(P["matte"], 100), effect="matte", hold=5, src=(8, 1, 2), gallery=["matte-m9-hands"])),
    # Styling Cream Pomade — «Естественный блеск», 100 ml
    ("pomade-f1", "F1", "pomade", "pomade", "POMADE", dict(scent="coconut", volumes=vt(P["pomade"], 100), effect="natural-shine", hold=5, src=(8, 3, 0), gallery=["pomade-stack"])),
    ("pomade-w10", "W10", "pomade", "pomade", "AMBER", dict(scent="amberWood", volumes=vt(P["pomade"], 100), effect="natural-shine", hold=4, src=(8, 3, 1))),
    ("pomade-w11", "W11", "pomade", "pomade", "SUN SENSE", dict(scent="cologne8", volumes=vt(P["pomade"], 100), effect="natural-shine", hold=4, src=(8, 3, 2))),
    # Styling Cream — «На водной основе», «Матовый эффект»
    ("styling-cream-medium", None, "styling-cream", "stylingCream", "MEDIUM HOLD", dict(volumes=vt(P["scream"], 100, 150), effect="matte", hold=2, src=(9, 1, 0), gallery=["styling-cream-hands"])),
    ("styling-cream-extra", None, "styling-cream", "stylingCream", "EXTRA HOLD", dict(volumes=vt(P["scream"], 30, 100, 150), effect="matte", hold=3, src=(9, 1, 1))),
    ("seasalt-spray", None, "seasalt", "seasalt", "SEASALT SPRAY", dict(volumes=v((200, 89000)), effect="matte", hold=3, src=(9, 1, 2))),
    # Powder Styling — «Естественный эффект», 20 g
    ("powder-cp", "CP", "powder", "powder", "WHITE COVERAGE", dict(volumes=v((20, 79000), unit="g"), effect="natural", hold=4, src=(10, 2, 0))),
    ("powder-p1", "P1", "powder", "powder", "POWDER HAIR WAX", dict(volumes=v((20, 75000), unit="g"), effect="natural", hold=5, src=(10, 2, 1), gallery=["powder-p1-box"])),
    ("powder-p5plus", "P5+", "powder", "powder", "POWDER HAIR WAX", dict(volumes=v((20, 85000), unit="g"), effect="natural", hold=5, holdPlus=True, src=(10, 2, 2))),
    # Hair Styling Gel — «Для густых и жестких волос», 300·750
    ("gel-g1", "G1", "gel", "hairGel", "GUMMY GEL CASUAL", dict(volumes=v((300, 69000)), hold=4, src=(11, 1, 0), gallery=["gel-g1-hands"])),
    ("gel-5", "5", "gel", "hairGel", "DYNAMIC STYLE", dict(volumes=v((750, 109000)), hold=5, src=(11, 1, 1))),
    ("gel-5plus-argan", "5+", "gel", "hairGel", "ARGAN", dict(volumes=v((300, 72000), (750, 115000)), hold=5, holdPlus=True, src=(11, 0, 2))),
    ("gel-5plus-gum", "5+", "gel", "hairGel", "GUM EFFECT", dict(volumes=v((300, 72000), (750, 115000)), hold=5, holdPlus=True, src=(11, 1, 2))),
    # Ultra Hold — «Для седых волос», 200·300
    ("gel-bg", "BG", "ultra-hold", "hairGel", "BLACK GEL", dict(volumes=v((200, 89000), (300, 112000)), src=(11, 2, 0))),
    ("grooming-spray", None, "styling-tonic", "groomingSpray", "GROOMING SPRAY", dict(volumes=v((200, 85000)), hold=3, src=(12, 3, 2))),
    ("hair-spray-04", "04", "styling-spray", "hairSpray", "EXTRA HOLD", dict(volumes=v((400, 79000)), hold=4, src=(13, 1, 0))),
    ("hair-spray-05", "05", "styling-spray", "hairSpray", "ULTRA HOLD", dict(volumes=v((400, 85000)), hold=5, src=(13, 1, 2))),

    # ===== 02 УХОД ЗА ВОЛОСАМИ =============================================================
    ("pro-shampoo-01", "01", "pro-shampoo", "shampoo", "SALT & PARABEN FREE", dict(volumes=v((200, 59000), (400, 85000), (1250, 169000)), forSalons=[1250], src=(16, 1, 0))),
    ("pro-shampoo-02", "02", "pro-shampoo", "shampoo", "SALT & PARABEN FREE", dict(volumes=v((200, 59000), (400, 85000), (1250, 169000)), forSalons=[1250], src=(16, 0, 1))),
    ("pro-shampoo-03", "03", "pro-shampoo", "shampoo", "INCA INCHI", dict(volumes=v((200, 62000), (400, 89000), (1250, 179000)), forSalons=[1250], src=(16, 1, 1))),
    ("pro-conditioner", None, "pro-conditioner", "conditioner", "KERATIN COMPLEX", dict(volumes=v((400, 89000)), src=(16, 1, 2))),
    ("salon-shampoo", "01", "salon-size", "shampoo", "SALON SIZE HAIR SHAMPOO", dict(volumes=v((5000, 459000)), forSalons=[5000], src=(16, 2, 2))),
    ("salon-conditioner", "01", "salon-size", "conditioner", "SALON SIZE HAIR CONDITIONER", dict(volumes=v((5000, 489000)), forSalons=[5000], src=(16, 3, 2))),
    ("hair-mask", None, "hair-mask", "hairMask", "INCA INCHI COMPLEX", dict(volumes=v((300, 99000), (750, 169000)), src=(15, 1, 1), extraSrc=[(15, 1, 2)], gallery=["hair-mask-jar"])),
    ("hair-tonic", None, "hair-tonic", "hairTonic", "HAIR TONIC", dict(volumes=v((200, 89000)), src=(12, 2, 1))),
    ("two-phase-conditioner", None, "two-phase", "twoPhase", "2 PHASE CONDITIONER", dict(volumes=v((400, 95000)), src=(12, 3, 0))),

    # ===== 03 ЦВЕТ И ОБЪЁМ =================================================================
    ("color-spray", None, "color-spray", "colorSpray", "HAIR SPRAY", dict(volumes=v((150, 65000)), hold=0,
        shades=["black", "white", "gold", "red", "yellow", "blue", "green", "pink", "purple", "glitterSilver", "glitterGold", "glitterMulticolor"], src=(14, 1, 0))),
    ("root-concealer", None, "root-concealer", "rootConcealer", "ROOT CONCEALER", dict(volumes=v((100, 99000)),
        shades=["lightBrown", "mediumBrown", "darkBrown", "black"], src=(14, 0, 2))),
    ("keratin-fiber", None, "keratin-fiber", "hairFiber", "KERATIN FIBER", dict(volumes=v((200, 149000)),
        shades=["lightBrown", "mediumBrown", "darkBrown", "black"], src=(15, 1, 0))),

    # ===== 04 БРИТЬЁ ===========================================================================
    ("shaving-gel-blue", "1|2", "shaving-gel", "shavingGel", "BLUE", dict(volumes=v((400, 69000), (1000, 129000)), forSalons=[1000], src=(17, 2, 0), gallery=["shaving-gel-hands"])),
    ("shaving-gel-colorless", "3|4", "shaving-gel", "shavingGel", "COLORLESS", dict(volumes=v((400, 69000), (1000, 129000)), forSalons=[1000], src=(17, 2, 1))),
    ("shaving-gel-gold-one", "7|8", "shaving-gel", "shavingGel", "GOLD ONE", dict(volumes=v((400, 72000), (1000, 135000)), forSalons=[1000], src=(17, 2, 2))),
    ("cream-cologne-1", "1", "cream-cologne", "creamCologne", "CITY SENIOR", dict(volumes=v((200, 59000), (400, 89000)), src=(18, 1, 0))),
    ("cream-cologne-2", "2", "cream-cologne", "creamCologne", "ARCTIC BLUE", dict(volumes=v((200, 59000), (400, 89000)), src=(18, 0, 1))),
    ("cream-cologne-3", "3", "cream-cologne", "creamCologne", "PYROGENOUS", dict(volumes=v((200, 59000), (400, 89000)), src=(18, 1, 1))),
    ("cream-cologne-4", "4", "cream-cologne", "creamCologne", "GOLD ONE", dict(volumes=v((200, 59000), (400, 89000)), src=(18, 0, 2))),
    ("cream-cologne-5", "5", "cream-cologne", "creamCologne", "INVISIBLE TOUCH", dict(volumes=v((200, 59000), (400, 89000)), src=(18, 1, 2))),
    ("cologne-1", "1", "cologne", "cologne", "ANTARCTICA", dict(volumes=v((100, 65000)), src=(19, 2, 0), gallery=["cologne-pocket"], swatch="#3fb6e0")),
    ("cologne-2", "2", "cologne", "cologne", "STORM", dict(volumes=v((100, 65000)), src=(19, 0, 1), swatch="#b77ad6")),
    ("cologne-3", "3", "cologne", "cologne", "NESLY", dict(volumes=v((100, 65000)), src=(19, 0, 2), swatch="#ee8f8f")),
    ("cologne-4", "4", "cologne", "cologne", "LEMON", dict(volumes=v((100, 65000)), src=(19, 1, 2), swatch="#e3e35a")),
    ("cologne-5", "5", "cologne", "cologne", "VOLCANO", dict(volumes=v((100, 65000)), src=(19, 2, 2), swatch="#d62d5e")),
    ("cologne-06", "06", "cologne", "cologne", "AQUA D'ASIL", dict(volumes=v((100, 65000)), src=(19, 3, 0), swatch="#1f8fd6")),
    ("cologne-07", "07", "cologne", "cologne", "GOLD ONE", dict(volumes=v((100, 65000)), src=(19, 4, 0), swatch="#e3b23c")),
    ("cologne-08", "08", "cologne", "cologne", "SUN SENSE", dict(volumes=v((100, 65000)), src=(19, 5, 0), swatch="#ddd8cb")),
    ("cologne-09", "09", "cologne", "cologne", "MARINE", dict(volumes=v((100, 65000)), src=(19, 3, 1), swatch="#8fcdf0")),
    ("cologne-10", "10", "cologne", "cologne", "AMBER", dict(volumes=v((100, 65000)), src=(19, 4, 1), swatch="#f0a47a")),
    ("cologne-11", "11", "cologne", "cologne", "LEADER", dict(volumes=v((100, 65000)), src=(19, 5, 1), swatch="#a9a6ef")),
    ("cologne-12", "12", "cologne", "cologne", "SPACE X", dict(volumes=v((100, 65000)), src=(19, 3, 2), swatch="#c4943f")),
    ("after-shave-lotion", "1", "after-shave-lotion", "afterShaveLotion", "ICEBERG", dict(volumes=v((200, 65000), (400, 95000)), src=(20, 2, 0))),
    ("talc-powder", None, "talc", "talc", "TALC POWDER", dict(volumes=v((180, 45000), unit="g"), src=(22, 2, 2))),

    # ===== 05 БОРОДА ===========================================================================
    ("beard-oil", None, "beard-oil", "beardOil", "CARE OIL", dict(volumes=v((30, 79000), (75, 115000)), src=(20, 3, 1))),
    ("beard-oil-gold-one", None, "beard-oil", "beardOil", "CARE OIL GOLD ONE", dict(volumes=v((30, 79000), (75, 115000)), src=(20, 2, 2))),
    ("beard-shampoo", None, "beard-wash", "beardShampoo", "SHAMPOO", dict(volumes=v((200, 89000)), src=(21, 1, 0), gallery=["beard-foam"])),
    ("beard-conditioner", None, "beard-wash", "beardConditioner", "CONDITIONER", dict(volumes=v((200, 89000)), src=(21, 1, 1))),
    ("beard-balm", None, "beard-balm", "beardBalm", "STYLING BALM", dict(volumes=v((100, 95000)), effect="matte", src=(21, 1, 2))),
    ("beard-perfume-adonis", None, "beard-perfume", "beardPerfume", "ADONIS", dict(volumes=v((75, 99000)), src=(22, 2, 0))),
    ("beard-perfume-genius", None, "beard-perfume", "beardPerfume", "GENIUS", dict(volumes=v((75, 99000)), src=(22, 3, 1), gallery=["beard-perfume-spray"])),

    # ===== 06 ЛИЦО =============================================================================
    ("peel-off-black", "01", "peel-off", "peelOffMask", "BLACK PEEL-OFF MASK", dict(volumes=v((150, 75000), (200, 89000)), src=(23, 2, 0))),
    ("peel-off-gold", "02", "peel-off", "peelOffMask", "GOLD PEEL-OFF MASK", dict(volumes=v((150, 75000), (200, 89000)), src=(23, 2, 1))),
    ("peel-off-silver", "03", "peel-off", "peelOffMask", "SILVER PEEL-OFF MASK", dict(volumes=v((150, 75000), (200, 89000)), src=(23, 3, 1))),
    ("peeling-gel", None, "skin-smoothing", "peelingGel", "PEELING GEL", dict(volumes=v((450, 119000)), src=(23, 3, 2))),
    ("facial-scrub-apricot", None, "facial-scrub", "facialScrub", "APRICOT", dict(scent="apricot", volumes=v((150, 59000), (300, 89000)), src=(24, 1, 0), gallery=["scrub-pour"])),
    ("facial-scrub-avocado", None, "facial-scrub", "facialScrub", "AVOCADO", dict(scent="avocado", volumes=v((150, 59000), (300, 89000)), src=(24, 1, 1))),
    ("clay-mask", None, "clay-mask", "clayMask", "CLAY MASK", dict(volumes=v((450, 129000)), src=(24, 1, 2))),
    ("hand-face-classic", None, "hand-face", "handFace", "HAND & FACE", dict(scent="classic", volumes=v((300, 79000)), src=(25, 1, 0), gallery=["hand-face-jar"])),
    ("hand-face-blackberry", None, "hand-face", "handFace", "HAND & FACE", dict(scent="blackberry", volumes=v((300, 79000)), src=(25, 1, 1))),
    ("hand-face-olive", None, "hand-face", "handFace", "HAND & FACE", dict(scent="olive", volumes=v((300, 79000)), src=(25, 0, 2))),
    ("hand-face-pomegranate", None, "hand-face", "handFace", "HAND & FACE", dict(scent="pomegranate", volumes=v((300, 79000)), src=(25, 1, 2))),

    # ===== 07 АКСЕССУАРЫ =======================================================================
    ("comb-t121", "T-121", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 39000), unit=PCS), src=(26, 2, 0))),
    ("comb-025", "025", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 45000), unit=PCS), src=(26, 3, 0))),
    ("comb-t120", "T-120", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 39000), unit=PCS), src=(26, 2, 1))),
    ("comb-t122", "T-122", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 42000), unit=PCS), src=(26, 3, 1))),
    ("comb-t125", "T-125", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 39000), unit=PCS), src=(26, 2, 2))),
    ("comb-t129", "T-129", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 45000), unit=PCS), src=(26, 3, 2))),
    ("comb-034", "034", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 49000), unit=PCS), src=(26, 2, 3))),
    ("comb-037", "037", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 42000), unit=PCS), src=(26, 3, 3))),
    ("comb-043", "043", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 49000), unit=PCS), src=(27, 0, 0))),
    ("comb-044", "044", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 49000), unit=PCS), src=(27, 1, 0))),
    ("comb-042", "042", "hair-comb", "comb", "HAIR COMB", dict(volumes=v((1, 45000), unit=PCS), src=(27, 0, 1))),
    ("fade-brush-r", None, "fade-brush", "fadeBrush", "FADE BRUSH «R»", dict(volumes=v((1, 75000), unit=PCS), src=(27, 2, 0))),
    ("boar-brush-premium", None, "barber-essentials", "boarBrush", None, dict(volumes=v((1, 119000), unit=PCS), src=(27, 3, 0))),
    ("neck-brush-954s", "954 S", "neck-brush", "neckBrush", "NECK BRUSH", dict(volumes=v((1, 65000), unit=PCS), src=(27, 2, 1))),
    ("neck-brush-974s", "974 S", "neck-brush", "neckBrush", "NECK BRUSH", dict(volumes=v((1, 69000), unit=PCS), src=(27, 3, 1))),
    ("neck-brush-564", "564", "neck-brush", "neckBrush", "NECK BRUSH", dict(volumes=v((1, 89000), unit=PCS), src=(27, 2, 2))),
    ("hair-brush-029", "029", "hair-brush", "brushing", "HAIR BRUSH", dict(volumes=v((1, 59000), unit=PCS), size="Ø 30", src=(27, 0, 2), gallery=["brushing-dryer"])),
    ("hair-brush-039", "039", "hair-brush", "brushing", "HAIR BRUSH", dict(volumes=v((1, 65000), unit=PCS), size="Ø 40", src=(27, 1, 2))),
    ("fade-brush-150", None, "fade-brush", "fadeBrush", "FADE BRUSH", dict(volumes=v((1, 69000), unit=PCS), size="150 mm", src=(27, 0, 3))),
    ("fade-brush-205", None, "fade-brush", "fadeBrush", "FADE BRUSH", dict(volumes=v((1, 89000), unit=PCS), size="205 mm", src=(27, 1, 3))),
    ("shaving-brush-1056", "1056", "barber-essentials", "shavingBrush", None, dict(volumes=v((1, 79000), unit=PCS), src=(27, 2, 3))),
    ("cape-master-barbers-black", None, "barber-essentials", "cape", "MASTER BARBERS", dict(variant="black", volumes=v((1, 249000), unit=PCS), src=(28, 2, 0))),
    ("cape-master-barbers-bw", None, "barber-essentials", "cape", "MASTER BARBERS", dict(variant="capeBlackWhite", volumes=v((1, 249000), unit=PCS), src=(28, 3, 0))),
    ("cape-nishman-black", None, "barber-essentials", "cape", "NISHMAN", dict(variant="black", volumes=v((1, 219000), unit=PCS), src=(28, 2, 1))),
    ("cape-nishman-stripe", None, "barber-essentials", "cape", "NISHMAN", dict(variant="capeStripe", volumes=v((1, 229000), unit=PCS), src=(28, 3, 1))),
    ("collar-dispenser", None, "barber-essentials", "dispenser", None, dict(volumes=v((1, 189000), unit=PCS), src=(28, 2, 2))),
    ("disposable-towels", None, "barber-essentials", "towels", None, dict(volumes=v((1, 99000), unit=PCS), size="70 × 40", src=(28, 3, 2))),
]

# Признак «эффект» по пилюлям PDF:
#   matte — «Матовый эффект», natural-shine — «Естественный блеск»,
#   semi-matte — «Полуматовый эффект», natural — «Естественный эффект» (пудры), None — не указан.

# --- Лайфстайл-фото: xref в PDF -> файл. Каждое фото используется на сайте ОДИН раз. -----------------
PHOTOS = {
    # hero (видео + постер)
    123: ("hero-barber", "hero"),
    449: ("hero-spray", "hero"),
    506: ("hero-comb", "hero"),
    40: ("hero-cans", "hero"),
    # о бренде
    1312: ("about-portrait", "about"),
    # индекс каталога (hover)
    318: ("index-styling", "index"),
    572: ("index-care", "index"),
    626: ("index-color", "index"),
    728: ("index-shaving", "index"),
    896: ("index-beard", "index"),
    1050: ("index-face", "index"),
    1104: ("index-accessories", "index"),
    # линейки
    325: ("lines-matte", "lines"),
    875: ("lines-cologne", "lines"),
    # партнёрам
    680: ("partners-salon", "partners"),
    # отзывы
    56: ("review-cherepovich", "reviews"),
    # адреса (демо-фото точек)
    603: ("store-chilanzar", "stores"),
    1204: ("store-yunusabad", "stores"),
    1263: ("store-mirabad", "stores"),
    # финальный CTA
    959: ("cta-dark", "cta"),
    # галереи товаров
    241: ("coloring-wax-palm", "gallery"),
    328: ("matte-m3-hands", "gallery"),
    346: ("matte-m4-hands", "gallery"),
    343: ("matte-m5-hands", "gallery"),
    378: ("matte-m7-hands", "gallery"),
    384: ("matte-m9-hands", "gallery"),
    411: ("pomade-stack", "gallery"),
    435: ("styling-cream-hands", "gallery"),
    493: ("powder-p1-box", "gallery"),
    508: ("gel-g1-hands", "gallery"),
    579: None,  # дубликат xref 40 (то же фото) — не используется
    660: ("hair-mask-jar", "gallery"),
    767: ("shaving-gel-hands", "gallery"),
    836: ("cologne-pocket", "gallery"),
    934: ("beard-foam", "gallery"),
    961: ("beard-perfume-spray", "gallery"),
    1017: ("scrub-pour", "gallery"),
    1091: ("hand-face-jar", "gallery"),
    1162: ("brushing-dryer", "gallery"),
    # лукбук
    42: ("look-cover", "lookbook"),
    464: ("look-powder", "lookbook"),
    188: ("look-jar", "lookbook"),
    669: ("look-fiber", "lookbook"),
    831: ("look-cream-cologne", "lookbook"),
    931: ("look-beard-duo", "lookbook"),
    1063: ("look-face-cream", "lookbook"),
    880: ("look-beard-trim", "lookbook"),
    349: ("look-cream-palm", "lookbook"),
    382: ("look-cream-drop", "lookbook"),
}
