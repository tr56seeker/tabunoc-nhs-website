# Claude Code Prompt: School Website Audit, Cleanup & Premium Upgrade

Copy everything below into Claude Code, run from the root of the school website project folder.

---

## Context

This is a school website codebase. I need a full audit and cleanup pass, followed by a set of concrete improvement recommendations to bring it up to a "premium" standard. Work in phases and report findings before making large changes.

## Phase 0: Orientation

1. Identify the tech stack (static HTML/CSS/JS, WordPress, a JS framework, etc.), build tooling, and how the site is deployed/served.
2. Map the project structure: pages, templates, components, assets, config files.
3. Note the package manager and check for a `package.json`, lockfile, or CMS version info.
4. Summarize findings before proceeding to Phase 1.

## Phase 1: Error & Duplicate Scan

Scan the full codebase and report, then fix, the following:

- **Syntax/runtime errors**: broken HTML tags, unclosed elements, invalid CSS, JS console errors, broken template logic.
- **Broken links & references**: dead internal links, missing images/assets (404s), broken anchor links, invalid `href`/`src` paths.
- **Duplicate code**: repeated CSS rules/selectors, duplicate JS functions, copy-pasted components/blocks that should be shared partials/includes, duplicate meta tags, duplicate IDs (invalid HTML).
- **Dead code**: unused CSS classes, unused JS files/functions, commented-out blocks left in production, orphaned pages not linked from navigation.
- **Inconsistencies**: mismatched fonts/colors across pages, inconsistent spacing/naming conventions, inline styles that should be in stylesheets.
- **Console/network errors**: missing favicons, failed script loads, mixed content (http assets on https pages), CORS issues.

For each issue found, list: file path, line number (if applicable), description, and the fix applied. Fix low-risk issues directly; flag anything structurally risky for my review before changing it.

## Phase 2: Improvement Audit (Design & UX)

Evaluate and report on:

- Mobile responsiveness across common breakpoints (phone, tablet, desktop).
- Navigation clarity — can a parent/prospective family find admissions, contact info, and calendar within 2 clicks?
- Visual consistency — typography scale, color palette, spacing, button styles.
- Homepage hierarchy — is the most important info (admissions CTA, contact, key announcements) above the fold?
- Accessibility basics — alt text on images, color contrast, semantic HTML, keyboard navigation, form labels.
- Image quality/optimization — oversized or unoptimized images, missing responsive `srcset`.

## Phase 3: Improvement Audit (Performance & SEO)

- Run/simulate a Lighthouse-style check (or use available tooling) covering performance, accessibility, best practices, SEO scores.
- Check page load weight — large uncompressed images, render-blocking scripts/CSS, missing lazy-loading.
- Check SEO fundamentals — title tags, meta descriptions, header tag structure (single H1 per page), sitemap.xml, robots.txt, structured data (schema.org for `EducationalOrganization`, events, breadcrumbs).
- Check for HTTPS, canonical tags, and Open Graph/Twitter Card meta tags for social sharing.
- Flag any pages missing SEO basics and provide the fix.

## Phase 4: Trust & Credibility Recommendations

Propose specific additions/upgrades (don't build unless I confirm), such as:

- Accreditation/certification badges and where to display them.
- Staff/faculty profile section with photos and credentials.
- Testimonials or parent/student success stories section.
- Clear, prominent admissions process page (steps, requirements, deadlines, application CTA).
- Events/news feed or announcements section to show the site is actively maintained.
- Contact page with map embed, phone, email, and office hours clearly listed.
- Privacy policy and data-handling statement (relevant if forms collect student/parent data).

## Deliverable

Produce a single summary report (markdown file) covering:

1. Stack/structure summary (Phase 0)
2. Full list of errors/duplicates found and fixed, with file references (Phase 1)
3. Design/UX findings with severity ranking (Phase 2)
4. Performance/SEO findings with severity ranking (Phase 3)
5. Prioritized "premium upgrade" roadmap — quick wins vs. larger projects (Phase 4)

Do not make sweeping structural or design changes without flagging them first. Fixes that are unambiguous bugs (broken links, duplicate IDs, unclosed tags, dead code) can be applied directly; anything involving new features, visual redesign, or content changes should be proposed, not auto-applied.
