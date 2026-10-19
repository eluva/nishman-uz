"""
Собирает зацикленный фон hero (≈10 c) из 4 фото моделей каталога:
медленный zoompan + xfade, тёмный цветокор, бесшовный цикл (кадр конца = кадр начала).

  python -I scripts/build-hero-video.py <папка-с-png> [public/media/video]

Если есть assets/hero.mp4 (или .mov) — используется он (только перекодируется).
ffmpeg: системный или из пакета imageio-ffmpeg (pip install imageio-ffmpeg).
"""
import os
import shutil
import subprocess
import sys

from PIL import Image

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/media/video"
os.makedirs(OUT, exist_ok=True)

ffmpeg = shutil.which("ffmpeg")
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

# (файл, фокус X, фокус Y) — точка интереса для кадрирования
FRAMES = [
    ("hero-barber.png", 0.45, 0.3),
    ("hero-spray.png", 0.5, 0.27),
    ("hero-comb.png", 0.6, 0.36),
    ("hero-cans.png", 0.5, 0.33),
]
FPS, CLIP, FADE = 25, 3.52, 1.0
GRADE = "eq=contrast=1.06:brightness=-0.06:saturation=0.8,vignette=PI/5"

VARIANTS = {
    # poster: разрешение постера (LCP) — для больших экранов выше, чем у видео
    "desktop": dict(w=1280, h=720, mp4="1250k", webm="700k", poster=(1920, 1080)),
    "mobile": dict(w=540, h=960, mp4="620k", webm="400k", poster=(720, 1280)),
}


def crop_box(iw, ih, w, h, fx, fy):
    target = w / h
    if iw / ih > target:
        cw, ch = int(ih * target), ih
    else:
        cw, ch = iw, int(iw / target)
    x = min(max(0, int(iw * fx - cw / 2)), iw - cw)
    y = min(max(0, int(ih * fy - ch / 2)), ih - ch)
    return cw, ch, x, y


def run(args):
    print(" ".join(args[:6]), "…")
    subprocess.run(args, check=True)


custom = next((p for p in ("assets/hero.mp4", "assets/hero.mov") if os.path.exists(p)), None)

def frames_graph(w, h, tag):
    """Граф ffmpeg из PNG-кадров: zoompan + xfade + бесшовный цикл + цветокор. Возвращает аргументы входа."""
    inputs, chains = [], []
    frames = int(round(CLIP * FPS))
    for i, (fname, fx, fy) in enumerate(FRAMES):
        path = os.path.join(SRC, fname)
        iw, ih = Image.open(path).size
        cw, ch, x, y = crop_box(iw, ih, w, h, fx, fy)
        inputs += ["-i", path]
        zin = "zoom+0.0011" if i % 2 == 0 else "zoom+0.0009"
        chains.append(
            f"[{i}:v]crop={cw}:{ch}:{x}:{y},scale={w * 2}:{h * 2}:flags=lanczos,"
            f"zoompan=z='min({zin},1.12)':d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={w}x{h}:fps={FPS},"
            f"setsar=1,format=yuv420p[c{i}]"
        )
    chains.append("[c0]split[a0][z0]")
    seq = ["a0", "c1", "c2", "c3", "z0"]
    prev, length = seq[0], CLIP
    for k, nxt in enumerate(seq[1:], 1):
        off = length - FADE
        chains.append(f"[{prev}][{nxt}]xfade=transition=fade:duration={FADE}:offset={off:.2f}[x{k}]")
        prev, length = f"x{k}", length + CLIP - FADE
    end = length - CLIP + FADE  # момент окончания последнего перехода
    chains.append(f"[{prev}]trim=start={FADE}:end={end:.2f},setpts=PTS-STARTPTS,{GRADE}[out]")
    script = os.path.join(OUT, f".filter-{tag}.txt")
    with open(script, "w", encoding="utf-8") as f:
        f.write(";\n".join(chains))
    return [ffmpeg, "-y", *inputs, "-filter_complex_script", script, "-map", "[out]", "-an"], script


def save_poster(png, name):
    img = Image.open(png).convert("RGB")
    img.save(os.path.join(OUT, f"hero-poster-{name}.webp"), "WEBP", quality=74, method=6)
    try:
        img.save(os.path.join(OUT, f"hero-poster-{name}.avif"), "AVIF", quality=58)
    except Exception as e:  # noqa: BLE001
        print("AVIF недоступен:", e)


for name, cfg in VARIANTS.items():
    w, h = cfg["w"], cfg["h"]
    out_mp4 = os.path.join(OUT, f"hero-{name}.mp4")
    out_webm = os.path.join(OUT, f"hero-{name}.webm")
    temp = []
    if custom:
        vf = f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},{GRADE},fps={FPS},format=yuv420p"
        base = [ffmpeg, "-y", "-i", custom, "-t", "12", "-an", "-vf", vf]
    else:
        base, script = frames_graph(w, h, name)
        temp.append(script)

    run(base + ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p",
                "-b:v", cfg["mp4"], "-maxrate", cfg["mp4"].replace("k", "") + "k", "-bufsize", "2500k",
                "-movflags", "+faststart", out_mp4])
    try:
        run(base + ["-c:v", "libvpx-vp9", "-b:v", cfg["webm"], "-row-mt", "1", "-deadline", "good",
                    "-cpu-used", "2", "-pix_fmt", "yuv420p", out_webm])
    except subprocess.CalledProcessError:
        print("WebM пропущен (нет libvpx-vp9)")

    # Постер = первый кадр ролика (LCP). Для больших экранов — тот же кадр в более высоком разрешении.
    png = os.path.join(OUT, f".poster-{name}.png")
    pw, ph = cfg.get("poster", (w, h))
    if custom:
        run([ffmpeg, "-y", "-i", custom, "-vf", f"scale={pw}:{ph}:force_original_aspect_ratio=increase,crop={pw}:{ph},{GRADE}",
             "-frames:v", "1", "-update", "1", png])
    elif (pw, ph) != (w, h):
        pbase, pscript = frames_graph(pw, ph, f"{name}-poster")
        temp.append(pscript)
        run(pbase + ["-frames:v", "1", "-update", "1", png])
    else:
        run([ffmpeg, "-y", "-i", out_mp4, "-frames:v", "1", "-update", "1", png])
    save_poster(png, name)
    for tmp in [png, *temp]:
        if os.path.exists(tmp):
            os.remove(tmp)

for f in sorted(os.listdir(OUT)):
    print(f"{f:32s} {os.path.getsize(os.path.join(OUT, f)) / 1024:8.0f} KB")
