#!/usr/bin/env python3
"""Generate favicon, OG image, and PWA icons for the portfolio."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = "/home/z/my-project/public"
os.makedirs(OUT, exist_ok=True)

BG = (8, 8, 12)
FG = (250, 248, 244)

FONT_PATH_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_PATH_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def font(size, bold=True):
    return ImageFont.truetype(FONT_PATH_BOLD if bold else FONT_PATH_REG, size)

def save_png(img, path, size=None):
    if size:
        img = img.resize(size, Image.LANCZOS)
    img.save(path, "PNG", optimize=True)

# 1. Monogram icons
def make_monogram(size, filename, with_border=True):
    img = Image.new("RGB", (size, size), BG)
    draw = ImageDraw.Draw(img)
    if with_border:
        border = max(1, size // 32)
        draw.rectangle([border, border, size - border, size - border],
                       outline=FG, width=max(1, size // 64))
    font_size = int(size * 0.55)
    f = font(font_size)
    text = "AG"
    bbox = draw.textbbox((0, 0), text, font=f)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]
    draw.text((x, y), text, font=f, fill=FG)
    save_png(img, f"{OUT}/{filename}")

print("Generating favicon + PWA icons...")
make_monogram(32, "favicon-32.png")
make_monogram(180, "apple-icon.png")
make_monogram(192, "icon-192.png")
make_monogram(512, "icon-512.png")

icon_32 = Image.open(f"{OUT}/favicon-32.png")
icon_32.save(f"{OUT}/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("  ✓ favicon.ico")
print("  ✓ favicon-32.png")
print("  ✓ apple-icon.png (180x180)")
print("  ✓ icon-192.png (PWA)")
print("  ✓ icon-512.png (PWA)")

# 2. SVG icon
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#08080c"/>
  <rect x="16" y="16" width="480" height="480" fill="none" stroke="#faf8f4" stroke-width="2" stroke-opacity="0.15"/>
  <text x="256" y="256" font-family="DejaVu Sans, Arial, sans-serif" font-size="280" font-weight="700" fill="#faf8f4" text-anchor="middle" dominant-baseline="central">AG</text>
</svg>'''
with open(f"{OUT}/icon.svg", "w") as f:
    f.write(svg)
print("  ✓ icon.svg")

# 3. OG image
def make_og(width, height, filename, layout="landscape"):
    img = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(img)
    if layout == "landscape":
        draw.text((80, 80), "AG ·", font=font(28, True), fill=FG)
        draw.text((150, 84), "FULL-STACK DEVELOPER", font=font(22, False), fill=(150, 150, 160))
        name = "Abdelhady Gabriel"
        nf = font(120, True)
        bbox = draw.textbbox((0, 0), name, font=nf)
        nw = bbox[2] - bbox[0]; nh = bbox[3] - bbox[1]
        x = (width - nw) // 2 - bbox[0]
        y = height // 2 - nh // 2 - 60
        draw.text((x, y), name, font=nf, fill=FG)
        role = "Full-Stack Developer & Product Engineer"
        rf = font(36, False)
        bbox = draw.textbbox((0, 0), role, font=rf)
        rw = bbox[2] - bbox[0]
        draw.text(((width - rw) // 2 - bbox[0], y + nh + 30), role, font=rf, fill=(180, 180, 190))
        tech = "Next.js 16  ·  React 19  ·  TypeScript  ·  Tailwind 4  ·  Prisma"
        tf = font(24, False)
        bbox = draw.textbbox((0, 0), tech, font=tf)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2 - bbox[0], height - 100), tech, font=tf, fill=(120, 120, 130))
        draw.line([(80, height - 60), (width - 80, height - 60)], fill=(60, 60, 70), width=1)
        draw.ellipse([80, height - 70, 90, height - 60], fill=(16, 185, 129))
        draw.text((100, height - 76), "Available for freelance & full-time", font=font(20, False), fill=(180, 180, 190))
    elif layout == "square":
        draw.text((80, 80), "AG ·", font=font(40, True), fill=FG)
        nf = font(100, True)
        y = 380
        for line in ["Abdelhady", "Gabriel"]:
            bbox = draw.textbbox((0, 0), line, font=nf)
            lw = bbox[2] - bbox[0]
            draw.text(((width - lw) // 2 - bbox[0], y), line, font=nf, fill=FG)
            y += 110
        role = "Full-Stack Developer & Product Engineer"
        rf = font(32, False)
        bbox = draw.textbbox((0, 0), role, font=rf)
        rw = bbox[2] - bbox[0]
        draw.text(((width - rw) // 2 - bbox[0], y + 40), role, font=rf, fill=(180, 180, 190))
        tech = "Next.js 16  ·  React 19  ·  TypeScript  ·  Tailwind 4"
        tf = font(22, False)
        bbox = draw.textbbox((0, 0), tech, font=tf)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2 - bbox[0], height - 100), tech, font=tf, fill=(120, 120, 130))
    save_png(img, f"{OUT}/{filename}")

print("\nGenerating Open Graph images...")
make_og(1200, 630, "og.png", "landscape")
print("  ✓ og.png (1200x630)")
make_og(1200, 1200, "og-square.png", "square")
print("  ✓ og-square.png (1200x1200)")
print("\n✅ All SEO assets generated")
