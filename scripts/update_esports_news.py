#!/usr/bin/env python3
"""Refresh the public MLBB esports news snapshot from MOONTON's official news pages."""
from __future__ import annotations
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "esports-news.json"
PAGES = [
    "https://en.moonton.com/news/index.html",
    "https://en.moonton.com/news/index1.html",
    "https://en.moonton.com/news/index2.html",
]
NEWS_PATH = re.compile(r"/news/\d+\.html(?:[?#].*)?$", re.I)
DATE_RE = re.compile(r"\b(20\d{2})[/-](\d{1,2})[/-](\d{1,2})\b")

def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()

def extract_page(url: str, html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    results = []
    seen = set()
    for anchor in soup.find_all("a", href=True):
        absolute = urljoin(url, anchor["href"])
        parsed = urlparse(absolute)
        if parsed.netloc.lower() != "en.moonton.com" or not NEWS_PATH.search(parsed.path) or re.fullmatch(r"index\d*\.html", parsed.path.rsplit("/", 1)[-1], re.I):
            continue
        heading = anchor.find(["h1", "h2", "h3", "h4", "h5"])
        anchor_text = clean(anchor.get_text(" ", strip=True))
        title = clean(heading.get_text(" ", strip=True)) if heading else anchor_text
        title = re.sub(r"^\s*20\d{2}[/-]\d{1,2}[/-]\d{1,2}\s*", "", title).strip()
        if not heading:
            # Some news cards wrap date, heading and summary in a single link.
            # Prefer a heading node, otherwise cut any embedded paragraph summary from the link text.
            for paragraph_node in anchor.find_all("p"):
                paragraph = clean(paragraph_node.get_text(" ", strip=True))
                if len(paragraph) > 45 and paragraph in title:
                    title = title.split(paragraph, 1)[0].strip()
                    break
        if not title or title.lower() in {"view more", "read more", "more"}:
            continue
        article_node = anchor
        best_text = title
        published = ""
        description = ""
        for _ in range(5):
            if article_node.parent is None:
                break
            article_node = article_node.parent
            text = clean(article_node.get_text(" ", strip=True))
            match = DATE_RE.search(text)
            if match and len(text) > len(best_text):
                best_text = text
                published = f"{match.group(1)}-{int(match.group(2)):02d}-{int(match.group(3)):02d}"
            paragraphs = [clean(p.get_text(" ", strip=True)) for p in article_node.find_all("p")]
            paragraphs = [p for p in paragraphs if p and p != title and len(p) > 45]
            if paragraphs:
                description = paragraphs[0][:420]
            # Stop after a compact card-like ancestor rather than swallowing the page.
            if title in text and match and len(text) < 1400:
                break
        if not published:
            match = DATE_RE.search(best_text)
            if match:
                published = f"{match.group(1)}-{int(match.group(2)):02d}-{int(match.group(3)):02d}"
        key = absolute.split("#", 1)[0]
        if key in seen:
            continue
        seen.add(key)
        results.append({
            "title": title[:240],
            "description": description,
            "published": published,
            "url": key,
        })
    return results

def main() -> int:
    session = requests.Session()
    session.headers.update({"User-Agent": "Grim_gg-EsportsNewsBot/1.0 (+https://2002ufepab-debug.github.io/Grim-gg-/)"})
    articles = []
    seen = set()
    for url in PAGES:
        try:
            response = session.get(url, timeout=25)
            response.raise_for_status()
            for article in extract_page(url, response.text):
                if article["url"] not in seen:
                    seen.add(article["url"])
                    articles.append(article)
        except Exception as exc:
            print(f"Warning: could not read {url}: {exc}", file=sys.stderr)
    # Never replace a useful existing feed with an empty or malformed scrape.
    if len(articles) < 3:
        print(f"Only {len(articles)} articles extracted; keeping existing feed.", file=sys.stderr)
        return 1
    articles.sort(key=lambda item: (item["published"] or "0000-00-00", item["url"]), reverse=True)
    articles = articles[:30]

    # Avoid a commit and Pages deployment every scheduled run when nothing changed.
    # updatedAt means the feed content last changed, not the last polling attempt.
    if OUT.exists():
        try:
            existing = json.loads(OUT.read_text(encoding="utf-8"))
            if existing.get("articles") == articles:
                print("No new or changed official news; keeping the existing feed unchanged.")
                return 0
        except (OSError, json.JSONDecodeError, AttributeError):
            pass

    payload = {
        "source": "MOONTON Games official news",
        "sourceUrl": "https://en.moonton.com/news/index.html",
        "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "articles": articles,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(payload['articles'])} articles to {OUT.relative_to(ROOT)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
