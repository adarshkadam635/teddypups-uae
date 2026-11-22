# AI usage log

TeddyPups UAE · Blutec AI technical assessment

## Tools and use

| Tool | Contribution |
| --- | --- |
| OpenAI Codex | Assisted with reference analysis, React implementation, animation, and test development. |
| ImageGen | Generated the illustrative homepage poodle portrait. [Media credits](MEDIA_CREDITS.md) |
| UI/UX Pro Max | Informed responsive layouts, interaction feedback, and reduced-motion behavior. |
| Chrome and Playwright | Inspected public routes and verified the production build across desktop and mobile widths. [Test results](TESTING_CHECKLIST.md) |

## Decisions and outcomes

- **Catalog.** React Router keeps listing filters shareable through URL parameters. The snapshot contains 15 available and 27 adopted profiles.
- **Design.** The site uses its own cream, peach, and mint palette, with an illustrated mascot, arched portraits, and scroll-driven doors. The [test results](TESTING_CHECKLIST.md) record the differences found during the reference comparison.
- **Media.** Stock photos, sample video, and the generated hero portrait are illustrative. [Media credits](MEDIA_CREDITS.md)
- **Contact.** Contact destinations use public configuration. The form validates input and prepares an email draft. No messages were sent during verification.

## Issues resolved

- **Reference capture.** Chrome revealed profile details after the pages loaded. The hero was recaptured after the intro animation cleared.
- **Media and layout.** Failed stock downloads were retried, the missing favicon was bundled locally, and the narrow contact layout was adjusted to keep fields readable.
- **Delivery links.** The app retains the delivery section anchor and redirects the short delivery route to it.

## Prompt archive

Expand a section to read the prompt text. The implementation prompt is a consolidated specification. [Loom walkthrough outline](LOOM_WALKTHROUGH.md)

<details>
<summary>ImageGen prompt</summary>

````text
Landscape 4:3 editorial photograph for an original premium puppy adoption boutique website. One small apricot toy poodle puppy, realistically photographed full front, sitting with two paws relaxed and a slight inquisitive head tilt, big dark eyes, fine curly hair, distantly centered at x 52%, face centered vertically at about 40% height, puppy including its head and paws fits within middle 75% of frame. A single cobalt blue cloth bandana with non-branded small off-white checks. Bold butter yellow seamless studio backdrop and floor filling whole image, warm directional daylight softly cast from upper left, natural short shadow at the paws, beautiful warm analog film tones, lively and sophisticated editorial photography with light grain, restrained and minimal. Important: photo only, no logo, no text, no frames, no other items or animals. Keep enough clear yellow space on both sides for responsive crop.
````

</details>

### Consolidated implementation specification

<details>
<summary>Project brief</summary>

````text
Project: TeddyPups UAE Website Clone and Reference-Guided Enhancement
Assessment: Blutec AI Technical Evaluation
Reference: https://puppy.instabizweb.com/
Instruction: Execute the implementation, one self-contained page module at a time, preserving shared architecture and already-working features. The goal is a faithful, responsive, accessible, production-buildable React application, not a design concept.

This specification consolidates the original cloning requirements and subsequent animation/design follow-ups into maintainable development modules. Where page-specific screenshots or recordings are available, inspect them before coding and follow the source-of-truth hierarchy in Module 00.
````

</details>

<details>
<summary>00 · Project foundation and shared design</summary>

````text
MODULE 00 — PROJECT FOUNDATION AND SHARED DESIGN CONTRACT
Role and mission
Act as a senior frontend engineer and UI implementation specialist. Reproduce the TeddyPups UAE site for the Blutec AI technical assessment, preserving verified page layout, visual treatment, content structure, interactions, and animation behavior. Implement the site; do not stop after writing a plan.

Reference: https://puppy.instabizweb.com/
Source-of-truth hierarchy
1. The user's most recent page-specific screenshot or screen recording governs the affected component's look and motion.
2. Verified observations of the live reference site govern remaining layout, text, content, navigation, and behavior.
3. The supplied original master prompt and follow-up notes fill documented gaps.
4. When references conflict or are inaccessible, note the conflict or limitation; do not claim a pixel match you cannot validate.
The later approved TeddyPups redesign uses oversized typography, cobalt blue, cream, and butter yellow, with editorial puppy photography and playful paper/stamp motifs. Apply that direction where evidenced by later references. Where a later screenshot overrides one specific section, retain unrelated site behavior. Do not introduce arbitrary gradients, glassmorphism, neon, generic cards, futuristic styling, extra sections, or unrelated animations.
First-pass reference audit
- Use browser tools to inspect every public page, scroll from top to bottom, and test interactive states.
- Capture reference screenshots at desktop and mobile sizes when available.
- Map verified routes, anchored sections, navigation destinations, footer links, images, videos, hover/focus states, animation triggers, and responsive changes.
- Record actual typography, colors, spacing, sizes, border radius, image crops, shadows, layout widths, and animation timing.
- Do not bypass restricted assets. If live content or earlier screenshots/videos are unavailable, document the absence and proceed with clearly identified closest supported alternatives.
- Preserve an audit checklist in REFERENCE_AUDIT.md with observed vs. assumed details.
Technology and architecture
- React + Vite; JavaScript (ES6+)
- Tailwind CSS for utilities, CSS for precision styling and animations
- React Router DOM for routes and browser navigation
- Lucide React only when its icons faithfully match the reference
- No unnecessary UI libraries, no fabricated backend, no hardcoded localhost links
Use a feature/module-based architecture: each page gets an independent folder, owns its page-specific sections and styles, and imports shared building blocks only when genuinely reusable.

src/
  app/
    App.jsx
    routes.jsx
  shared/
    assets/
    components/       # Header, Footer, MobileMenu, SectionHeading, Buttons
    motion/           # page curtain, scroll behaviors, accessibility fallbacks
    config/           # site contact links, navigation, theme tokens
    hooks/
    styles/           # tokens.css, global.css
    utils/
  modules/
    home/
      HomePage.jsx
      components/
      styles/
    puppies/
      PuppiesPage.jsx
      PuppyDetailPage.jsx
      components/    # PuppyCard, PuppyGallery, FilterPanel
      data/          # puppies.js
      styles/
    happy-families/
      HappyFamiliesPage.jsx
      components/
      data/
      styles/
    how-it-works/
      HowItWorksPage.jsx
      components/
      styles/
    faq/
      FAQPage.jsx
      components/
      data/          # faqs.js
      styles/
    contact/
      ContactPage.jsx
      components/
      styles/
    gone-home/
      GoneHomePage.jsx
      components/
      data/
      styles/
    additional-pages/
  main.jsx
public/
  photos/
  videos/
  illustrations/

Adjust names to the existing repository rather than duplicating equivalent files. Avoid unnecessary global CSS selectors. Make data-driven shared content consistent across routes.

Shared UI and behavior
- Match the cream navigation, scalloped trim, centered desktop links, active paw marker, and mobile menu where shown in the later navbar reference.
- Match the source header's observed behavior while scrolling upward and downward.
- Use accessible semantic HTML, keyboard-focus styles, labeled controls, descriptive alt text, and reduced-motion fallbacks.
- Use a centralized verified design-token system for palette, typography, container width, spacing, radii, shadows, and motion durations.
- Links, CTAs, WhatsApp/email contact actions, page transitions, menus, and site navigation must be functional.
- Preserve correct refresh/deep-link behavior for routes and URL-driven state.
Module completion contract
For each subsequent module: inspect the relevant live page and available media; implement its complete content and interactions; test desktop, mobile, keyboard, and direct-route loading; compare screenshots; report what is complete, what was actually tested, and any remaining limitations. Do not break previously completed modules. Maintain development notes without inventing results.
````

</details>

<details>
<summary>01 · Homepage</summary>

````text
MODULE 01 — HOMEPAGE
Route: /
Scope: Homepage only, plus the shared components it directly requires. Keep all homepage-specific story scenes and animations inside src/modules/home/.
Content and section order
Rebuild every homepage section in the reference's verified order:
- Announcement / introductory strip; TeddyPups logo and site navigation
- Full hero with exact headline hierarchy, editorial puppy portrait, and primary/secondary CTAs
- Available puppies preview, including interactive individual portraits/cards
- “Two ways to meet your puppy” and local-versus-imported paths
- Puppy adoption journey and trust/health guarantees
- Happy-family moments, testimonials, and gallery preview
- FAQ preview (the later interaction reference starts with three answers visible)
- Final CTA, complete footer, floating WhatsApp/contact controls
Do not remove a section merely because its content also appears on another page. Match actual copy and media where accessible.
Homepage motion and visual scenes
Implement the latest evidenced motion language rather than generic fade-ins:
1. Opening portrait: staggered portrait peeks/reveals; individual puppy portraits are interactive, with verified click motion. Use the specified original local photos where present.
2. Puppy mascot: original illustrated dog; match its observed left/right facing direction and pose, especially around the hero and scroll-linked catalog. Include a short entrance walk and portrait-click hop when supported.
3. Kennel / sleeping interaction: keep a kennel/house beside the hero portrait when present in the supplied follow-up. After inactivity the mascot walks inside to sleep; pointer activity, scrolling, or clicks wake/move it. Do not let this collide with the later end-scene resting mascot in a basket/porch; treat them as separate story moments where the references show both.
4. Scroll-linked catalog: maintain the mascot near the left while puppy cards slide horizontally past, highlight the passing card, and flow smoothly into the adoption section. Follow the reference's actual direction and pacing.
5. Hallway of swinging doors: reproduce the sequence observed around the middle of the reference recording; portraits/puppies are revealed behind doors.
6. Adoption scenes: showroom illustration reveals on entry; imported-puppy airplane follows its illustrated SVG route from Korea to Dubai; include adoption/phone conversation scenes.
7. Later narrative scenes: passport, photo wall, daybreak/dusk, and final evening porch / resting puppy scene when present in the recording.
8. Cursor treatment: the original paw cursor and brief desktop trail, only where the current visual reference uses them.
9. Motion behavior: cards, paper notes, pins, stamps, and section reveals must follow the observed sequence. Do not substitute arbitrary effects or looping animations.
The prior supplied recording described a roughly 36-second overview: portrait peeks early; swinging doors around 13–21 seconds; adoption/phone around 21–24 seconds; passport, photo wall, and evening porch through the end. These are reference observations, not mandated fixed-time milestones: align motion to scroll position and actual reference behavior instead of hardcoding video timestamps.
Responsive and accessibility
- Desktop scroll-linked scenes may use scroll progress and directional movement. Preserve natural touch scrolling on mobile; provide manual controls when a desktop interaction cannot reasonably translate.
- Avoid hijacking nested scrolling, interactive fields, and browser controls.
- On prefers-reduced-motion, show the completed content in a readable static state: open doorways, revealed portraits, visible conversation/passport, and the resting mascot. No mandatory animation to obtain information.
- Prevent mascot/kennel overlays from covering important CTAs.
Acceptance tests
All homepage navigation and portrait controls work; the mascot faces/moves in the correct direction; local/imported CTAs navigate correctly; all animation scenes are visible and correctly sequenced; no broken media; 1440px and 390px layouts resemble the supplied references; 320px view has no horizontal overflow.
````

</details>

<details>
<summary>02 · Available puppies catalog</summary>

````text
MODULE 02 — AVAILABLE PUPPIES CATALOG
Route: /puppies
Scope: Listing page, filter UI, and reusable catalog cards; do not rewrite unrelated pages.
Design and content
- Full reference heading and introduction, exact catalog layout, spacing, palette, and image proportions.
- The initial source notes observed 15 available puppies; reconcile with currently verified listings. Render each authentic available item, not cloned placeholder records.
- Each card displays verified name, breed, sex, age, status, and video badge where applicable. Use the correct photo for each puppy; never repeat a single stock image across all cards.
- Reflect the later catalog recording's circular portrait treatment and hover/focus motion where shown. Maintain accessible controls and responsive card distribution.
- Include the five-photo adopted/gone-home preview observed in the later recording, with navigation to /gone-home.
Filter interaction
- Reproduce the current reference's one-click single-choice filters; clicking the selected filter again clears it.
- Keep selected visual state accurate and synchronize filters with the URL where the reference supports that.
- Accept verified male/female query parameter values and existing project aliases; preserve shareable links, refresh, and browser Back behavior.
- Show a meaningful empty state if no puppies match.
Navigation and behavior
Every card navigates to the correct /puppies/:slug route. Hover and keyboard-focus states should match the reference. Handle loading/failed images gracefully without inventing additional stock assets.
Acceptance tests
Verify each filter state, toggle-to-clear behavior, query/deep links, all card destinations, mobile grid, image fit, and adopted preview. Check against desktop and mobile reference screenshots.
````

</details>

<details>
<summary>03 · Individual puppy profile</summary>

````text
MODULE 03 — INDIVIDUAL PUPPY PROFILE
Route: /puppies/:slug
Scope: One dynamic template that correctly renders each real puppy profile; reuse catalog data rather than duplicating entire pages.
Required sections
- Breadcrumbs and valid catalog return navigation
- Puppy name, breed, gender, age, available/adopted state, location or import details
- Main photo/video area, clickable thumbnails, previous/next controls, and media-position indicator
- Corresponding health and vaccination information; adoption/import journey information
- Relevant WhatsApp enquiry CTA and puppy-specific enquiry form
- Previous and next puppy links, according to the reference's ordering and availability
Visual design and motion
- Match the source's exact image crop, card proportions, puppy-specific tag/sticker styling, content hierarchy, and mobile arrangements.
- Use the verified profile-gallery transitions, loading states, photo/video controls, and active-thumbnail treatment; preserve image/video accessibility and keyboard use.
- Use only each puppy's genuine attached media or documented legally usable substitutes. Never show an image belonging to a different puppy without explicitly documenting the substitute.
Data and state
Build a structured dataset keyed by stable slugs. Keep catalog cards and profiles synchronized; unknown slugs should show a helpful 404/return option. Puppy-specific enquiry must carry the puppy identity to the contact workflow without pretending to submit to a nonexistent backend.
Acceptance tests
Open every available puppy slug directly, reload it, switch media, use next/previous, activate enquiries, and check at mobile size. Do not claim completeness until every verified profile works.
````

</details>

<details>
<summary>04 · Happy families</summary>

````text
MODULE 04 — HAPPY FAMILIES
Route: /happy-families
Scope: Page-level gallery, testimonials, lightbox, and responsive composition.
Required content and UI
- Reference page title and introduction; authentic family testimonials where available
- Full gallery using the supplied family photos, in the correct relative layout/order
- The source observations mention 64 family moments; use all legitimately available moments rather than creating fake copies to force a count
- Later recording: staggered print/polaroid-style photo arrangement with paw-shaped pins; preserve the intended randomness while retaining readable, balanced composition
- Match photo aspect ratios, spacing, shadows, rotations, textures, and responsive arrangements shown in the visuals
Lightbox behavior
- Open selected photo at full size with correct index
- Previous/next controls; keyboard arrows and Escape
- Proper focus handling and focus return to the image that opened the lightbox
- Responsive media scaling without clipping faces or photo details
- Accessible photo labels and no broken URLs
Acceptance tests
Test first, middle, and last gallery items; keyboard and touch behavior; focus restoration; mobile layout; and photo count based on available verified data.
````

</details>

<details>
<summary>05 · How it works</summary>

````text
MODULE 05 — HOW IT WORKS / ADOPTION GUIDE
Route: /how-it-works
Scope: Complete process page, anchored section navigation, and the Dubai/imported guide switcher.
Page content
Recreate the main introduction and the verified order of sections: section navigation, two ways home, local adoption process, imported puppy ordering process, premium puppy promise, delivery/collection details, why choose us, and final CTA.
Required interactions
- A working In Dubai / Imported tab control: changing the choice changes the corresponding page panel, including its illustration and content. Avoid a cosmetic-only tab.
- Persist the selected adoption path in the URL and restore it on direct links, refresh, and browser Back/Forward.
- Section navigation and anchors scroll to the correct position without hiding headings behind the sticky header.
- Show showroom artwork for the local path and the flight illustration from Korea to Dubai for the imported path, matching the later reference.
- Match observed guide-step and route illustrations/animations; support reduced-motion static states.
Acceptance tests
Both tabs show their own correct content; deep-linked selected tabs load on first visit; browser history and scroll anchors work; mobile tabs remain operable and readable.
````

</details>

<details>
<summary>06 · FAQ</summary>

````text
MODULE 06 — FREQUENTLY ASKED QUESTIONS
Route: /faq
Scope: Searchable FAQ page, accordion behavior, and page-specific noticeboard visuals.
Content
The initial reference audit recorded nine FAQ entries. Copy all verified questions/answers from the reference (or from available project content) without inventing facts. Maintain centralized FAQ data used by the homepage preview.
Design direction
Use the later video-guided warm noticeboard layout, including the verified paper notes, pin treatment, spacing, and short answer expansion transitions. Preserve the exact heading hierarchy and site navigation identity.
Functionality
- Search input filters questions as the user types (case-insensitive); match actual reference behavior when observed
- Expand/collapse answers with correct aria controls, keyboard access, and smooth but brief motion
- Show an explicit no-results state
- Functional WhatsApp enquiry CTA
- Keep content accessible when JavaScript animation is skipped or prefers-reduced-motion is enabled
Acceptance tests
All recorded FAQ items render; searching finds matching entries; no-results state appears; accordion and keyboard interactions work; transitions do not hide answer content; page is usable at 320px.
````

</details>

<details>
<summary>07 · Visit and contact</summary>

````text
MODULE 07 — VISIT & CONTACT
Route: /contact
Scope: Full contact page, letter-style enquiry form, contact actions, and location information.
Visual direction
Follow the supplied follow-up screenshot for the warm palette, bold headline, stamped stationery/paper elements, and inline conversational letter fields. Keep the letter-style flow rather than replacing it with a generic stacked form. Match the available screenshot's alignment, whitespace, typography, and responsive behavior.
Fields and information
- Full name
- Phone/WhatsApp number
- Email address
- Area/location
- Selected puppy (where relevant), linked to actual puppy data
- Optional message
- Genuine business contact information, showroom location, hours if verified, and map link
Behavior
- Validate all required fields and format-sensitive fields; show clear field-level errors and focus management.
- Preserve the existing configuration-driven contact links.
- If a functioning submission service is verified and configured, submit with real success/error feedback.
- If no backend is connected, retain the established email-draft fallback clearly labeled as opening the user's email client. Never display a false “message delivered” success notification.
- WhatsApp and mail links must open correctly and include selected puppy context when possible.
- Any decorative letter stamp/submission animation must not imply confirmed delivery.
Acceptance tests
Valid/invalid submissions, selecting a puppy from its profile, email-client fallback, contact URL behavior, accessibility, and mobile layout.
````

</details>

<details>
<summary>08 · Gone home</summary>

````text
MODULE 08 — GONE HOME / ADOPTED PUPPIES
Route: /gone-home
Scope: Adoptions archive page and its detail links where they truly exist.
Content and visuals
- Complete reference title, introduction, and verified adopted puppy entries
- Decorative ticket-style cards with matching image dimensions, paper texture, typography, and stamps where shown
- Verified puppy-specific name/breed/status details; do not manufacture additional adoptees to fill the grid
- Correct responsive composition and hover/focus states
- Functional detail links only for pages that exist; otherwise use a non-link presentation that does not mislead visitors
Relationships
The catalog's adopted preview must lead here. Reuse legitimate puppy images and consistent shared data while keeping the archive independent of current-availability filters.
Acceptance tests
Cards load correctly, metadata is consistent, existing routes are reachable, and desktop/mobile layouts match the reference.
````

</details>

<details>
<summary>09 · Additional public routes</summary>

````text
MODULE 09 — ADDITIONAL VERIFIED PUBLIC ROUTES
Scope: Only public pages beyond the named eight that are actually discoverable from the live reference's site navigation, cards, footers, or CTAs. In particular, check for distinct delivery and collection pages.
Instructions
1. Audit all reachable links and produce a route inventory.
2. For each verified, distinct page, create a self-contained route module in src/modules/additional-pages/.
3. Replicate its reference sections, original copy, visuals, navigation behavior, mobile layout, and functional actions.
4. For external links, retain the original valid URL and interaction; do not fabricate internal routes.
5. Add route-level smoke tests and link coverage. A route absent from the source must not be invented merely to make the app appear more complete.
Acceptance tests
Every verified public internal link resolves correctly and reloads directly; every relevant footer link and CTA is tested; missing references are documented in the audit.
````

</details>

<details>
<summary>10 · Shared motion and navigation</summary>

````text
MODULE 10 — SHARED MOTION, NAVIGATION, AND INTERACTION SYSTEM
Scope: Cross-page visual behavior only. Do not overwrite a page's verified, section-specific motion with a generic global effect.
Navigation and shared UI
- Cream navbar with scalloped trim, centered links, and active paw marker where shown; responsive hamburger and reliable close behavior
- Preserve observed sticky-header behavior during scroll up/down
- Page-to-page reveal styled as a paper curtain with the original site puppy illustration; later follow-up timing was approximately 820 ms, with a short hold. Use the actual reference if available.
- Page transitions must work with click navigation, browser Back, direct route loads, keyboard navigation, and reduced-motion preferences.
- Animated paw stamps during navigation if present in the later redesign.
- Smooth desktop wheel easing only where compatible with observed behavior; do not hijack touch scrolling, nested scroll containers, form controls, or assistive devices.
Shared interaction requirements
- Original paw cursor and short desktop trail where appropriate; do not interfere with clickable target visibility; disable on touch/reduced-motion.
- Staggered reveals, paper pins/notes, gallery transitions, puppy tag animation, short FAQ transitions, letter stamp, daybreak/dusk, scroll scenes, and portrait interactions must be coordinated and nonconflicting.
- Support safe cleanup of event listeners, observers, and animation frames on route changes; avoid layout thrashing, hydration warnings, trapped focus, or memory leaks.
- Controls need hover, focus-visible, active, and disabled states as appropriate.
- All internal nav, buttons, WhatsApp links, email links, section anchors, footer links, galleries, tabs, search, and forms must work.
Reduced motion
Use prefers-reduced-motion throughout. Skip nonessential scroll choreography and the page curtain, reveal final content immediately, and keep every feature operable.
Acceptance tests
Cross-route regression, keyboard-only visit, touch input, nested scrolling, reduced motion, browser history, repeated navigation, and no console warnings/errors from motion cleanup.
````

</details>

<details>
<summary>11 · Testing and deployment</summary>

````text
MODULE 11 — TESTING, DEPLOYMENT READINESS, AND TECHNICAL-ASSESSMENT DOCUMENTATION
Visual and responsive verification
Compare live/local screenshots at 1440px, 1024px, 768px, 390px, and 320px. Validate backgrounds, fonts, colors, content widths, spacing, section heights, borders, radii, textures, cards, image crops, decoration, animation direction, and responsive navigation. Confirm no horizontal overflow, overlapping text, broken images, unusable forms, or inaccessible controls.
Functional QA
- Test every defined route by direct URL and refresh, plus browser Back/Forward
- Verify mobile hamburger and navbar active states
- Verify all catalog filters and card/detail links
- Test profile galleries and prev/next navigation
- Test Happy Families lightbox, keyboard arrows, Escape, and focus return
- Test adoption tabs and URL synchronization
- Test FAQ search, accordion, and no-results state
- Test form validation, WhatsApp/email links, and accurate submission feedback
- Check footer links, section anchors, and accessibility/reduced-motion states
- Run the app locally, inspect browser console, and fix all blocking issues
- If Playwright is installed/available, add automated smoke tests for main routes and user journeys
Production and Vercel
Ensure npm install, npm run dev, and npm run build succeed. Add SPA routing/refresh handling for Vercel, correct static paths, .gitignore, .env.example only if required, and no leaked secrets/hardcoded localhost URLs. Prepare deployment configuration but do not claim deployed unless actual deployment succeeded.
Assessment documentation
Produce and accurately maintain:
- REFERENCE_AUDIT.md: observed reference pages, design details, discrepancies, and missing assets
- AI_USAGE_LOG.md: exact AI prompts actually used; tool, scope, result, and date as genuinely known
- LOOM_WALKTHROUGH.md: logical walkthrough of development, folder structure, technologies, AI tools/prompts, decisions, animation approaches, challenges, testing, and deployment process
- TESTING_CHECKLIST.md: tested cases, observed results, failures/fixes, remaining issues (no invented pass results)
- README.md: project overview, setup, scripts, architecture, known constraints, and deployment instructions


Completion criteria
The work is ready only when all verified public pages and profiles are implemented, the current visual references are closely matched, all relevant interactions function, mobile and reduced-motion experiences are usable, test and build results are honest and passing, no visible missing media or dead links remain, and the assessment documentation is complete.


Final response required from Codex
Provide: (1) modules completed, (2) files/routes changed, (3) commands and tests actually run and their results, (4) screenshot comparison summary if performed, (5) outstanding differences/blocked reference assets, and (6) precise build/deploy instructions. Do not say anything was inspected, tested, recorded, or deployed unless it actually was.
````

</details>
