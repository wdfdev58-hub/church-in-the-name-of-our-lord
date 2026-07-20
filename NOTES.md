# Church In The Name of our Lord — build notes

## Brief
- Location: Magojaneng Village, Kuruman, Northern Cape
- Pastor: Pastor Mokgadi Thapelo
- Short wordmark: In His Name
- Palette: royal
- Theme: open bible, radiant cross, one body gathered
- Hero: "People of" / "the Name."
- Scripture: Ephesians 4:4-5
- Moments heading: "One body, one Spirit, one hope"

## Real onboarding details (from WDF app onboarding — not placeholders)
- Service times: Sundays 10:00 · Wednesdays 16:00 · Fridays 17:00
- Address: 1932 Itlotleng Street, Magojaneng Village, next to Maradona ground
- Pastor's cell: 076 693 8812
- Church email: makgaodit@gmail.com

These were patched into `index.html` after the generator ran (times & place section,
visit CTA "Call the church" link, and the Google Maps embed query) since the generator's
placeholders don't know real church data.

## Status
v1 built via `generate.py --palette royal`, pushed to GitHub.

## Phase 2 — refine (2026-07-20)
Rebuild from the church's real Lovable site (churchinthenameofourlord.lovable.app), using
the operator's screenshots plus assets pulled directly from the live site's asset bundle:
- Real emblem (open Bible + radiant cross + "ONE" checklist) → `assets/img/emblem.png` /
  `emblem-sm.png` (nav, footer, favicon, and a medallion in the new beliefs section).
- Real sanctuary photo (open Bible, stained glass, radiant light) → `assets/img/hero.jpg`.
- Real congregation-hands-raised photo → `assets/img/welcome.jpg`.
- CTA background replaced with a non-seasonal open-Bible-and-cross Pexels photo (the
  original had Christmas garland/lights baked in — swapped for `visit.jpg`).

Real content carried in: hero tagline "We are people of the Name of Jesus", the sevenfold
Ephesians 4:4-6 sub-line, the confirmed vision statement, the welcome paragraph, the four
real ministries (Children's, Youth, Family, Home Fellowships), and the five-ones scripture
set (Deut 6:4, Heb 11:6, Acts 2:38, Phil 2:11, Matt 16:18) alongside Ephesians 4:4-6 itself.

New signature element: a pinned scroll sequence (`#oneness` in index.html/main.js) that
recites the sevenfold "one body, one Spirit, one hope, one Lord, one faith, one baptism,
one God and Father of us all" phrase by phrase, then settles on the full verse — this
replaces the old generic pinned scripture card. Static/no-motion fallback shows "one body"
plus the full quote (see `.one-word` rules in css/style.css).

**Corrected vs. the old Lovable site (per operator instruction — WDF's onboarding data is
authoritative, not the old site):**
- Address: 1932 Itlotleng Street, Magojaneng Village (NOT the old site's fake
  "147 Grace Avenue, Riverside, CA 92501").
- Times: Sundays 10:00 (both agree) · Wednesdays 16:00, Fridays 17:00 (old site said
  Wed 7pm / Fri 6:30pm — wrong, from the pastor via WDF instead).

Also removed the old "Revival Fire Ministry" template leftovers that didn't fit this
church's identity: the 🔥 eyebrow icon (now a plain gold dot), "Fuel the fire" / "Bring
everything" / "room at this fire" copy, the emoji favicon, and stray template comments.
