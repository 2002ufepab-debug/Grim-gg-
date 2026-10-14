# Grim_gg hero image automation

## Current phase: safe source audit

This repository currently loads most hero artwork from external GitHub repositories.
The first automation phase intentionally DOES NOT download, transform, replace, or publish images.
It checks whether the source URLs currently referenced by script.js and data/hero-catalog.json respond, then creates JSON and CSV reports.

### What is included

- Current hero catalog image URLs.
- The high-resolution portrait source map in HERO_HD_IMAGE_FILES.
- The splash-art source map in HERO_SPLASH_ART_OVERRIDES.
- A report that lists the hero, source type, source filename, URL, response status, content type, and error if any.
- A GitHub Actions workflow that runs on relevant pull requests or can be started manually from the Actions tab once this workflow is on the default branch.

### Run locally

Requires Python 3.10+ and no third-party packages:

    python tools/hero_images/audit_sources.py

Parse the current source maps without making network requests:

    python tools/hero_images/audit_sources.py --no-network

Reports are written to artifacts/hero-image-audit/report.json and artifacts/hero-image-audit/report.csv.

## Next phase: image processing (not enabled yet)

After reviewing the source audit and confirming source permissions and usage terms, add a separate processor that works on approved local source files. The processor should:

1. Preserve originals and write derived files to a separate output folder.
2. Fit images to a common canvas without stretching.
3. Use transparency bounds to align transparent character renders.
4. Avoid automatic destructive cropping of opaque splash art.
5. Store per-hero scale and focal-point overrides for difficult compositions.
6. Produce a contact sheet and validation report before any site code is changed.

Do not connect generated files to the live site until a human has reviewed the sample set and approved the resulting pull request. Keep the current external-image fallback until local assets have been validated.

## Why this is staged

Image availability is not the same as permission to redistribute artwork. The audit only checks accessibility. Before copying images into this public repository, verify the relevant source terms and permissions. GitHub Pages is static hosting, so processing belongs in GitHub Actions rather than in the browser.
