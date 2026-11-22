# Testing checklist

## Reference review

- Inspected the seven primary pages and all 42 publicly reachable puppy profiles.
- Captured desktop and mobile reference states and exercised the catalog filters, FAQ, gallery, and navigation.
- The historical 11-state visual comparison passed capture and runtime checks and exceeded the visual difference thresholds. The submitted design uses original layouts and illustrations with replacement media documented in [Media credits](MEDIA_CREDITS.md).

## Submission verification

Tested the production build with Playwright and Google Chrome on Windows on 22 November 2026.

| Check | Result |
| --- | --- |
| Install and build | Clean installation with `npm ci` and production build with `npm run build` |
| Browser smoke suite | All 26 tests passed. See the [test suite](tests/smoke.spec.js) for coverage and assertions |
| Responsive layout | Main routes checked at 1440, 1024, 768, 390, and 320 px |
| Puppy catalog and profiles | Direct profile links, filters, galleries, sample video, and previous/next navigation |
| Homepage interactions | Portrait introductions, cursor effects, hallway doors, kennel idle behavior, and reduced motion |
| Adoption and family pages | Local and imported tabs, delivery anchors, gallery navigation, and keyboard focus return |
| Contact and FAQ | FAQ search and expansion, letter validation, and email draft generation |

The enquiry form prepares a draft in the visitor’s email app. The public demo uses the available contact fallbacks. End-to-end message delivery was outside this verification.

## Deployment

The [public Vercel demo](https://teddypups-assessment.vercel.app/) uses the SPA rewrite in `vercel.json`.
