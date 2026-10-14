#!/usr/bin/env python3
"""Audit remote hero image sources without changing the live site.

Reads the current hero catalog and image maps in script.js, probes each unique
source with a small ranged GET, and writes JSON/CSV reports. It deliberately
does not download, modify, or publish artwork.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / "data" / "hero-catalog.json"
SCRIPT = ROOT / "script.js"
REPORT_DIR = ROOT / "artifacts" / "hero-image-audit"
USER_AGENT = "GrimGG-HeroImageAudit/1.0 (+https://github.com/2002ufepab-debug/Grim-gg-)"


def parse_js_map(source: str, name: str) -> dict[str, str]:
    match = re.search(r"\bconst\s+" + re.escape(name) + r"\s*=\s*\{(.*?)\n\};", source, re.S)
    if not match:
        raise ValueError(f"Could not find JavaScript map {name}")
    pairs = re.findall(r'"([^"]+)"\s*:\s*"([^"]*)"', match.group(1))
    return dict(pairs)


def read_sources() -> list[dict[str, str]]:
    if not CATALOG.is_file() or not SCRIPT.is_file():
        raise FileNotFoundError("Expected data/hero-catalog.json and script.js in repository root")
    heroes = json.loads(CATALOG.read_text(encoding="utf-8"))
    if not isinstance(heroes, list) or not heroes:
        raise ValueError("Hero catalog is empty or is not a JSON array")

    js = SCRIPT.read_text(encoding="utf-8")
    hd_map = parse_js_map(js, "HERO_HD_IMAGE_FILES")
    splash_map = parse_js_map(js, "HERO_SPLASH_ART_OVERRIDES")
    override_map = parse_js_map(js, "HERO_IMAGE_OVERRIDES")

    base_match = re.search(r'const\s+HERO_IMAGE_BASE\s*=\s*\n?\s*"([^"]+)"', js)
    if not base_match:
        raise ValueError("Could not locate HERO_IMAGE_BASE in script.js")
    avatar_base = base_match.group(1)

    sources: dict[str, dict[str, str]] = {}

    def add(hero: str, kind: str, url: str, source_file: str = "") -> None:
        if not url.startswith(("https://", "http://")):
            return
        item = sources.setdefault(url, {"hero": hero, "kind": kind, "url": url, "source_file": source_file})
        if hero not in item["hero"].split("; "):
            item["hero"] += "; " + hero
        if kind not in item["kind"].split("; "):
            item["kind"] += "; " + kind

    for hero in heroes:
        name = str(hero.get("name_hero") or hero.get("name") or hero.get("hero_name") or "").strip()
        if not name:
            continue
        image_file = str(hero.get("images-hero") or "").strip()
        if image_file.startswith(("https://", "http://")):
            add(name, "catalog-url", image_file, image_file)
        elif image_file:
            filename = image_file.removeprefix("images-hero/")
            add(name, "catalog-avatar", avatar_base + quote(filename, safe=""), filename)
        else:
            normalized = re.sub(r"[^a-z0-9]", "", name.lower())
            filename = override_map.get(name.lower(), normalized + ".png")
            add(name, "generated-avatar", avatar_base + quote(filename, safe=""), filename)

        key = re.sub(r"[^a-z0-9]", "", name.lower())
        if key in hd_map:
            filename = hd_map[key]
            url = "https://raw.githubusercontent.com/Lara3924/Lara_Image/main/" + quote(filename, safe="")
            add(name, "hd-portrait", url, filename)
        if key in splash_map:
            path = splash_map[key]
            encoded_path = "/".join(quote(part, safe="") for part in path.split("/"))
            url = "https://raw.githubusercontent.com/Sparkies01/Splash/main/" + encoded_path
            add(name, "splash-art", url, path)

    if len(heroes) < 100:
        raise ValueError(f"Unexpectedly small hero catalog ({len(heroes)} entries); refusing to produce a misleading report")
    return sorted(sources.values(), key=lambda row: (row["hero"].casefold(), row["kind"], row["url"]))


def probe(item: dict[str, str], timeout: float, retries: int) -> dict[str, str]:
    result = dict(item)
    last_error = ""
    for attempt in range(retries + 1):
        try:
            request = Request(
                item["url"],
                headers={
                    "User-Agent": USER_AGENT,
                    "Range": "bytes=0-0",
                    "Accept": "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.5",
                },
                method="GET",
            )
            with urlopen(request, timeout=timeout) as response:
                result["status"] = str(response.status)
                result["content_type"] = response.headers.get("Content-Type", "")
                result["content_length"] = response.headers.get("Content-Length", "")
                result["result"] = "ok" if response.status in (200, 206) else "http-error"
                response.read(1)
                return result
        except HTTPError as exc:
            result["status"] = str(exc.code)
            result["content_type"] = exc.headers.get("Content-Type", "") if exc.headers else ""
            result["content_length"] = exc.headers.get("Content-Length", "") if exc.headers else ""
            last_error = f"HTTP {exc.code}"
            if exc.code not in (408, 425, 429, 500, 502, 503, 504):
                break
        except (URLError, TimeoutError, OSError) as exc:
            last_error = f"{type(exc).__name__}: {exc}"
        if attempt < retries:
            time.sleep(0.5 * (attempt + 1))
    result.update({"status": "", "content_type": "", "content_length": "", "result": "failed", "error": last_error})
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=8, help="Concurrent URL checks (default: 8)")
    parser.add_argument("--timeout", type=float, default=12, help="Seconds per request (default: 12)")
    parser.add_argument("--retries", type=int, default=1, help="Retries for temporary network errors (default: 1)")
    parser.add_argument("--no-network", action="store_true", help="Validate parsing and list sources without probing URLs")
    parser.add_argument("--report-dir", type=Path, default=REPORT_DIR, help="Directory for JSON and CSV reports")
    args = parser.parse_args()

    try:
        sources = read_sources()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    print(f"Catalog parsed. Unique source URLs: {len(sources)}")
    if args.no_network:
        rows = [dict(item, status="", content_type="", content_length="", result="not-checked", error="") for item in sources]
    else:
        rows = []
        with ThreadPoolExecutor(max_workers=max(1, min(args.workers, 16))) as pool:
            futures = {pool.submit(probe, item, args.timeout, max(0, args.retries)): item for item in sources}
            for index, future in enumerate(as_completed(futures), start=1):
                rows.append(future.result())
                if index % 25 == 0 or index == len(futures):
                    print(f"Checked {index}/{len(futures)}")
        rows.sort(key=lambda row: (row["hero"].casefold(), row["kind"], row["url"]))

    args.report_dir.mkdir(parents=True, exist_ok=True)
    json_path = args.report_dir / "report.json"
    csv_path = args.report_dir / "report.csv"
    catalog_count = len(json.loads(CATALOG.read_text(encoding="utf-8")))
    json_path.write_text(json.dumps({"catalog_entries": catalog_count, "unique_urls": len(rows), "results": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["hero", "kind", "source_file", "url", "result", "status", "content_type", "content_length", "error"])
        writer.writeheader()
        writer.writerows(rows)

    failed = [row for row in rows if row["result"] == "failed"]
    ok = sum(row["result"] == "ok" for row in rows)
    print(f"Report: {json_path}")
    print(f"Report: {csv_path}")
    print(f"Successful sources: {ok}; failed sources: {len(failed)}")
    if failed:
        print("Failed examples:")
        for row in failed[:15]:
            print(f"- {row['hero']} [{row['kind']}]: {row['url']} ({row.get('error') or row.get('status')})")
    # Provider outages can be transient; the report is the deliverable.
    # Fail only on structural/input errors, not on external-source outages.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
