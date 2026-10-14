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


for section_id in ("home", "heroes", "tierlist", "items", "perks", "builds", "favorites", "guides", "esports"):
    require(f'id="{section_id}"' in html, f"Missing core section #{section_id}")

require('href="?page=talents"' in html, "Talent page must be reachable from the main navigation")
require('href="favicon.svg"' in html, "Main page favicon reference is missing")
require('id="counterpicks"' not in html and 'href="?page=counterpicks"' not in html,
        "Removed counterpick section must not reappear in the page or navigation")
require("styles.css?v=" in (ROOT / "404.html").read_text(encoding="utf-8"),
        "404 page must load a versioned main stylesheet")
require('href="/Grim-gg-/favicon.svg"' in (ROOT / "404.html").read_text(encoding="utf-8"),
        "404 page must use the correct GitHub Pages favicon path")
for route in ("home", "heroes", "tierlist", "items", "perks", "talents", "builds", "favorites", "guides", "esports"):
    require(f'href="?page={route}"' in html, f"Main navigation is missing route ?page={route}")

require('if (requestedPage !== "talents") section.classList.add("page-hidden");' in talents,
        "Talent section must respect the initial page route")
require('"perks","talents","builds"' in script, "Talent route is missing from the page router")
require('page === "talents" ? "talentLab"' in script, "Talent route must reveal the dynamically created talent section")
require('talents: "Таланты и эмблемы"' in script, "Talent route title is missing")
require('id="talentHeroPortrait"' in talents and "heroArtByName" in talents,
        "Talent planner must render the selected hero portrait when the source is available")
require("GrimGGHeroImageUrl" in script and "GrimGGHeroImageUrl" in talents,
        "Talent planner must prefer the shared HD hero image resolver")
require("fallbackImage:catalogImage" in script and "hero.fallbackImage && hero.fallbackImage !== hero.image" in script,
        "Hero cards must retain the catalog portrait as an HD-image fallback")
require("this.dataset.retry!==this.src" in script,
        "Hero image fallback must not retry the same broken URL")
require('this.dataset.retry!==this.src' in script and "item-image" in script,
        "Item image fallback must avoid retrying the same broken URL")
require('img.dataset.fallback = catalogUrl && catalogUrl !== url ? catalogUrl : "";' in talents,
        "Talent portrait must retry the catalog image before showing a placeholder")
require('if (requestedPage !== "talents") section.classList.add("page-hidden");' in talents,
        "Talent Lab must stay hidden except on its own route")
require('id="talentRole"' in talents and 'id="talentHero"' in talents and 'id="talentStyle"' in talents,
        "Talent planner must expose role, hero and playstyle selectors")
require('id="talentCopy"' in talents and 'id="talentReset"' in talents,
        "Talent planner copy/reset actions are missing")
require("const emblemNames" in talents and "КЛЮЧЕВОЙ" in talents and "Weapon Master" in talents,
        "Talent planner must include emblem families and talent tiers")
require("https://openmlbb.fastapicloud.dev/api/academy/emblems?lang=en&size=100" in talents and "https://mlbb.rone.dev/api/academy/emblems?lang=en&size=100" in talents,
        "Talent planner must try both public academy endpoints for original talent icons")
require("skill?.skillicon" in talents and "talent-original-icon" in talents and "talent-icon-fallback-hidden" in talents,
        "Talent planner must load original talent icons and retain a visible fallback")
require("new MutationObserver" in talents and "refreshIcons" in talents,
        "Dynamically rendered talent icons must be enhanced after the API responds")

require("@media(max-width:700px)" in talent_css, "Talent planner needs a mobile layout")

require("object-fit: contain" in wide_styles and "focus-visible" in wide_styles,
        "Responsive polish must preserve artwork and keyboard focus visibility")
require("@media (max-width: 650px)" in wide_styles and "grid-template-columns: minmax(0, 1fr)" in wide_styles,
        "Mobile hero actions must stack cleanly on narrow screens")
require("prefers-reduced-motion: reduce" in wide_styles,
        "Reduced-motion preference must be respected")
require("object-fit: contain" in talent_css and "min-height: 42px" in talent_css,
        "Talent icons and controls must remain clear and touch-friendly")

require(".hero-image-wrap::after" in styles and "display: none !important" in styles and "background: none !important" in styles,
        "Hero portrait cards must not retain a dark overlay after labels are removed")
require("linear-gradient(145deg, #30232d 0%, #241b27 58%, #30212a 100%)" in styles,
        "Hero portrait background must be brighter than the previous near-black tint")
require("translateEquipmentName(name)" in script and "ru:translateEquipmentName(name)" in script,
        "External equipment catalog names must be translated to Russian")
require("EQUIPMENT_RU_NAMES" in script and "Original" not in script,
        "Russian equipment-name dictionary must exist without a hardcoded English card label")
require('class="item-original-name"' in script and 'summary>Оригинальное название</summary>' in script,
        "Original equipment names should remain available on demand")
require("onerror" in script and "hero-image-fallback" in script,
        "Hero image errors must have a visible fallback")
require('"lesley": "https://raw.githubusercontent.com/Sparkies01/Splash/main/Lesley/Deadly%20Sniper.png"' in script,
        "Lesley must use a full-resolution original splash-art image")
require('item.id === "retribution"\n      ? "https://raw.githubusercontent.com/Alexandre221178/alexandregames/main/img-MLBB/spells/retribution-ca%C3%A7ar.webp"' in script,
        "Base Retribution must use a verified game-spell icon source")
require("Array.isArray(payload?.records)" in talents and "skill?.icon_url" in talents,
        "Talent icon loader must handle alternate public API response shapes")
require("grid-template-columns: repeat(3, minmax(0, 1fr))" in wide_styles and "object-fit: cover" in wide_styles,
        "Hero directory must show larger game-like portraits in a three-column phone grid")
require("font-size: 9px; line-height: 1.25; min-height: 36px" in wide_styles,
        "Mobile hero-card actions must remain readable and touch-friendly")
require(".hero-grid .hero-card-actions { grid-template-columns: repeat(2, minmax(0, 1fr))" in wide_styles,
        "Three-column hero cards must keep build and 3D actions in a compact two-column row")

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
