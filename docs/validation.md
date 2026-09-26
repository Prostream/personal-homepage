# Validation notes

Validation date: September 26, 2026.

This file records actual checks, rather than claiming completion of the entire course rubric.

## Automated checks

- `npm run check`: passed (recommended ESLint and Prettier).
- W3C Nu HTML Checker (`https://validator.w3.org/nu/?out=json`): all three HTML files were submitted as UTF-8 HTML. **0 errors and 0 warnings**. The checker returned 12 / 9 / 6 informational notices for `index.html` / `work.html` / `ai.html`, respectively, about Prettier's trailing slashes on void tags. All attribute values are quoted; these notices are not validation errors.
- Local HTML asset links, page links, fragment targets, unique IDs, image alternative attributes, and module script types: checked with Python's standard-library HTML parser; passed.
- SVG files: parsed as XML successfully.

## Browser checks

- Desktop viewport: 1280 × 900. Homepage and project layout inspected.
- Mobile viewport: 390 × 844. All three pages fit the viewport without horizontal overflow.
- All four journey buttons show exactly their matching entry and update `aria-pressed`.
- All four project filters show the expected articles and visible counts (one per topic; three for All).
- Project filters also activate correctly through Enter and Space.
- Shared navigation opens the expected distinct pages, and the third page shows its AI disclosure.
- No browser console errors or warnings were recorded during these checks.
- Screenshots: `docs/screenshots/home.png`, `work.png`, and `home-mobile.png`.

## Public deployment

The deployment and live URLs are verified after the initial repository push.

## Remaining course items

The course homepage URL, class-specific ESLint configuration, public narrated video, Google Form submission, and course code review remain author/instructor tasks. The README's GenAI disclosure is intentionally blank in this version and must also be completed before submission. See `submission.md`.
