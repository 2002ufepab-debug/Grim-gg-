#!/usr/bin/env python3
"""Fast, dependency-free structural smoke tests for the Grim_gg static site."""
from __future__ import annotations
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []

def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)

html = (ROOT / "index.html").read_text(encoding="utf-8")
styles = (ROOT / "styles.css").read_text(encoding="utf-8")
talents_styles = (ROOT / "talents.css").read_text(encoding="utf-8")
wide_styles = (ROOT / "layout-wide.css").read_text(encoding="utf-8")
script = (ROOT / "script.js").read_text(encoding="utf-8")
talents = (ROOT / "talents.js").read_text(encoding="utf-8")
talent_css = (ROOT / "talents.css").read_text(encoding="utf-8")

# Cache keys intentionally change during fixes; validate versioned asset paths without pinning versions.
for asset in ("styles.css", "talents.css", "layout-wide.css", "script.js", "talents.js"):
    require(any(f"{asset}?v=" in line for line in html.splitlines()),
            f"index.html must load {asset} with a versioned cache key")

# Catch duplicate static IDs and accidentally unbalanced CSS before publishing.
static_ids = re.findall(r"""\bid=["']([^"']+)["']""", html)
require(len(static_ids) == len(set(static_ids)), "index.html contains duplicate element IDs")
for stylesheet_name, stylesheet in (
    ("styles.css", styles),
    ("talents.css", talents_styles),
    ("layout-wide.css", wide_styles),
):
    require(stylesheet.count("{") == stylesheet.count("}"),
            f"{stylesheet_name} has unbalanced CSS braces")


for section_id in ("home", "heroes", "tierlist", "items", "perks", "builds", "favorites", "guides", "counterpicks", "esports"):
    require(f'id="{section_id}"' in html, f"Missing core section #{section_id}")

require('href="?page=talents"' in html, "Talent page must be reachable from the main navigation")
require('href="favicon.svg"' in html, "Main page favicon reference is missing")
require("styles.css?v=" in (ROOT / "404.html").read_text(encoding="utf-8"),
        "404 page must load a versioned main stylesheet")
require('href="/Grim-gg-/favicon.svg"' in (ROOT / "404.html").read_text(encoding="utf-8"),
        "404 page must use the correct GitHub Pages favicon path")
for route in ("home", "heroes", "tierlist", "items", "perks", "talents", "builds", "favorites", "guides", "counterpicks", "esports"):
    require(f'href="?page={route}"' in html, f"Main navigation is missing route ?page={route}")

require('knownPages.includes(requestedPage)' in talents and 'section.classList.add("page-hidden")' in talents,
        "Talent section must respect the initial page route")
require('"perks","talents","builds"' in script, "Talent route is missing from the page router")
require('page === "talents" ? "talentLab"' in script, "Talent route must reveal the dynamically created talent section")
require('talents: "Таланты и эмблемы"' in script, "Talent route title is missing")
require('id="talentHeroPortrait"' in talents and "heroArtByName" in talents,
        "Talent planner must render the selected hero portrait when the source is available")
require('id="talentRole"' in talents and 'id="talentHero"' in talents and 'id="talentStyle"' in talents,
        "Talent planner must expose role, hero and playstyle selectors")
require('id="talentCopy"' in talents and 'id="talentReset"' in talents,
        "Talent planner copy/reset actions are missing")
require("const emblemNames" in talents and "КЛЮЧЕВОЙ" in talents and "Weapon Master" in talents,
        "Talent planner must include emblem families and talent tiers")
require("@media(max-width:700px)" in talent_css, "Talent planner needs a mobile layout")
require("onerror" in script and "hero-image-fallback" in script,
        "Hero image errors must have a visible fallback")

# Ensure every first-party script/style/icon referenced by index.html exists.
for attr, value in re.findall(r'\b(href|src)="([^"]+)"', html):
    if attr not in {"href", "src"} or value.startswith(("#", "?", "http://", "https://", "data:", "mailto:", "tel:")):
        continue
    path = urlparse(value).path
    if not path:
        continue
    require((ROOT / path).is_file(), f"Broken local {attr} reference: {value}")

feed_path = ROOT / "data" / "esports-news.json"
try:
    feed = json.loads(feed_path.read_text(encoding="utf-8"))
    articles = feed.get("articles")
    require(isinstance(articles, list) and len(articles) > 0, "Esports feed must contain at least one article")
    for article in articles or []:
        require(isinstance(article.get("title"), str) and bool(article["title"].strip()),
                "Every esports article needs a title")
        url = article.get("url", "")
        require(url.startswith("https://en.moonton.com/news/"),
                f"Unexpected esports source URL: {url}")
except (OSError, json.JSONDecodeError, AttributeError) as exc:
    errors.append(f"Could not validate esports feed: {exc}")

if errors:
    print("GRIM_GG SMOKE TEST: FAILED")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print("GRIM_GG SMOKE TEST: PASS")
print("Checked core sections, talent routing/controls, local asset references and esports feed.")
