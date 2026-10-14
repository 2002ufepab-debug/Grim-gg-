#!/usr/bin/env python3
"""Normalize approved local hero art into consistent, non-destructive WebP canvases."""
from __future__ import annotations

import argparse
import json
import math
import sys
import tempfile
from pathlib import Path
from typing import Any

try:
    from PIL import Image, ImageDraw, ImageOps
except ImportError:
    Image = None
    ImageDraw = None
    ImageOps = None

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "tools" / "hero_images" / "manifest.json"
SOURCE_ROOT = ROOT / "assets" / "heroes" / "source"
OUTPUT_ROOT = ROOT / "assets" / "heroes" / "processed"
CANVAS = (600, 800)


def require_pillow() -> None:
    if Image is None:
        raise RuntimeError("Pillow is required. Install it with: python -m pip install Pillow")


def fit_art(source: "Image.Image", mode: str, scale: float, focal_x: float, focal_y: float,
            target: tuple[int, int] = CANVAS) -> "Image.Image":
    """Place art on a fixed canvas without stretching or cropping opaque splash art."""
    require_pillow()
    if not (0.1 <= scale <= 1.0):
        raise ValueError("scale must be between 0.1 and 1.0; zooming beyond fit could crop artwork")
    if not (0.0 <= focal_x <= 1.0 and 0.0 <= focal_y <= 1.0):
        raise ValueError("focal_x and focal_y must be between 0 and 1")

    image = ImageOps.exif_transpose(source).convert("RGBA")
    canvas_w, canvas_h = target
    if mode == "transparent":
        alpha = image.getchannel("A")
        # Ignore almost-transparent antialiasing pixels when finding the character bounds.
        alpha = alpha.point(lambda value: 255 if value > 12 else 0)
        bounds = alpha.getbbox()
        if bounds:
            image = image.crop(bounds)
    elif mode != "splash":
        raise ValueError("type must be 'transparent' or 'splash'")

    # Fit the full image to the canvas. scale=1.0 fills the maximum available area;
    # per-hero scale overrides tune the visible size without distorting proportions.
    factor = min(canvas_w / image.width, canvas_h / image.height) * scale
    new_w = max(1, min(canvas_w, round(image.width * factor)))
    new_h = max(1, min(canvas_h, round(image.height * factor)))
    image = image.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", target, (0, 0, 0, 0))
    left = round((canvas_w - new_w) * focal_x)
    top = round((canvas_h - new_h) * focal_y)
    # Keep the entire resized image inside the canvas; never cut off heads or weapons.
    left = max(0, min(canvas_w - new_w, left))
    top = max(0, min(canvas_h - new_h, top))
    canvas.alpha_composite(image, (left, top))
    return canvas


def process_entry(entry: dict[str, Any], source_root: Path, output_root: Path) -> Path:
    require_pillow()
    hero = str(entry.get("hero", "")).strip()
    source_name = str(entry.get("source", "")).strip()
    output_name = str(entry.get("output", "")).strip()
    if not hero or not source_name or not output_name:
        raise ValueError("Each manifest entry needs hero, source, and output")
    source_path = (source_root / source_name).resolve()
    output_path = (output_root / output_name).resolve()
    if source_root.resolve() not in source_path.parents:
        raise ValueError(f"Source path escapes source directory: {source_name}")
    if output_root.resolve() not in output_path.parents:
        raise ValueError(f"Output path escapes output directory: {output_name}")
    if not source_path.is_file():
        raise FileNotFoundError(f"{hero}: source image not found: {source_path}")
    mode = str(entry.get("type", "splash")).lower()
    scale = float(entry.get("scale", 1.0))
    focal_x = float(entry.get("focal_x", 0.5))
    focal_y = float(entry.get("focal_y", 0.5))

    with Image.open(source_path) as source:
        normalized = fit_art(source, mode, scale, focal_x, focal_y)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    normalized.save(output_path, "WEBP", quality=90, method=6)
    return output_path


def make_contact_sheet(images: list[tuple[str, Path]], output_path: Path) -> None:
    require_pillow()
    if not images:
        return
    thumb_size = (150, 200)
    columns = min(4, len(images))
    rows = math.ceil(len(images) / columns)
    sheet = Image.new("RGB", (columns * thumb_size[0], rows * (thumb_size[1] + 30)), "#181a22")
    draw = ImageDraw.Draw(sheet)
    for index, (name, path) in enumerate(images):
        with Image.open(path) as image:
            thumb = image.convert("RGBA")
            thumb.thumbnail(thumb_size, Image.Resampling.LANCZOS)
            x = (index % columns) * thumb_size[0] + (thumb_size[0] - thumb.width) // 2
            y = (index // columns) * (thumb_size[1] + 30)
            sheet.paste(thumb, (x, y), thumb)
        draw.text(((index % columns) * thumb_size[0] + 5, (index // columns) * (thumb_size[1] + 30) + thumb_size[1] + 5), name[:22], fill="#ffffff")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, "PNG")


def self_test() -> int:
    require_pillow()
    with tempfile.TemporaryDirectory(prefix="grimgg-image-test-") as temp:
        root = Path(temp)
        src = root / "source"
        out = root / "processed"
        src.mkdir()
        # Synthetic transparent render and opaque splash fixture; no game artwork is used.
        transparent = Image.new("RGBA", (300, 500), (0, 0, 0, 0))
        draw = ImageDraw.Draw(transparent)
        draw.ellipse((95, 25, 205, 135), fill=(230, 230, 230, 255))
        draw.rectangle((75, 130, 225, 430), fill=(100, 140, 230, 255))
        transparent.save(src / "fixture-transparent.png")
        Image.new("RGB", (900, 1200), "#777777").save(src / "fixture-splash.png")
        entries = [
            {"hero": "Fixture Transparent", "source": "fixture-transparent.png", "output": "transparent.webp", "type": "transparent", "scale": 1.0, "focal_x": 0.5, "focal_y": 0.5},
            {"hero": "Fixture Splash", "source": "fixture-splash.png", "output": "splash.webp", "type": "splash", "scale": 1.0, "focal_x": 0.5, "focal_y": 0.5},
        ]
        outputs = [process_entry(entry, src, out) for entry in entries]
        for path in outputs:
            with Image.open(path) as image:
                if image.size != CANVAS or image.format != "WEBP":
                    raise AssertionError(f"Unexpected output for {path.name}: {image.size}, {image.format}")
        sheet = root / "contact-sheet.png"
        make_contact_sheet([(entry["hero"], path) for entry, path in zip(entries, outputs)], sheet)
        if not sheet.is_file():
            raise AssertionError("Contact sheet was not generated")
    print("Image processor self-test passed: transparent render, splash art, 600x800 WebP, contact sheet.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    parser.add_argument("--source-dir", type=Path, default=SOURCE_ROOT)
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_ROOT)
    parser.add_argument("--self-test", action="store_true", help="Run tests with synthetic images only")
    args = parser.parse_args()
    try:
        require_pillow()
        if args.self_test:
            return self_test()
        if not args.manifest.is_file():
            print(f"No manifest yet: {args.manifest}. Copy manifest.example.json to manifest.json after approved source files are collected.")
            return 0
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
        entries = manifest.get("heroes", [])
        if not isinstance(entries, list):
            raise ValueError("Manifest must contain a 'heroes' array")
        processed: list[tuple[str, Path]] = []
        for entry in entries:
            path = process_entry(entry, args.source_dir, args.output_dir)
            processed.append((str(entry["hero"]), path))
            print(f"Processed {entry['hero']}: {path}")
        make_contact_sheet(processed, args.output_dir / "contact-sheet.png")
        print(f"Processed {len(processed)} images. Review the contact sheet before connecting files to the site.")
        return 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError, KeyError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
