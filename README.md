# TeddyPups UAE assessment

A React and Vite storefront for the Blutec AI technical assessment. It covers puppy browsing, adoption guidance, and enquiries, with an illustrated mascot and a scroll-driven hallway on the homepage.

[Live Vercel demo](https://teddypups-assessment.vercel.app/)

The catalog reflects the public reference as inspected on 21 November 2026. The design and animations are original adaptations. The photos and sample video are illustrative. The [media credits](MEDIA_CREDITS.md) identify the stock sources and generated hero image.

## Run locally

Use Node.js 20.19+ on the 20.x line, or 22.12+ on a current line.

```sh
npm ci
npm run dev
```

Build and preview the production output with these commands.

```sh
npm run build
npm run preview
```

For browser tests, build the site first, then install Playwright Chromium and run the suite.

```sh
npx playwright install chromium
npm test
```

You can also set `PLAYWRIGHT_CHANNEL=chrome` to use an installed copy of Google Chrome.

## Contact configuration

Copy `.env.example` to `.env.local` and enter confirmed contact details. Vite embeds any `VITE_` values in the client build, so use only public destinations.

| Variable | Purpose |
| --- | --- |
| `VITE_ENQUIRY_EMAIL` | Recipient prefilled on email drafts |
| `VITE_WHATSAPP_NUMBER` | Shop WhatsApp number in international digits-only format |
| `VITE_CONTACT_PHONE` | Public number shown as a call link |

The form validates input and creates a `mailto:` draft. It sends no data to a server. With no configured email, the draft has an empty recipient. With no configured WhatsApp number, chat calls to action take visitors to the contact page. The map link searches for Downtown Dubai because a verified street address was unavailable.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Animated puppy companion, scroll-linked catalog preview, adoption overview, health records, family moments and FAQ preview |
| `/puppies` | 15 available listings with shareable location, breed and gender filters |
| `/puppies/:slug` | 42 available and adopted profiles with galleries and enquiry drafts |
| `/happy-families` | 64 illustrative photos in a keyboard-operable lightbox and one summarized reference testimonial |
| `/how-it-works` | Local and imported processes, health, delivery and support |
| `/how-it-works#delivery` | Delivery and collection deep link, also reached through `/delivery` |
| `/faq` | Nine searchable FAQ entries |
| `/contact` | Letter-style enquiry, optional configured contact methods and a map link |
| `/gone-home` | 27 adopted profiles |

## Project structure

- `src/pages/` contains route views.
- `src/components/` contains shared navigation, galleries, accordion, cards and forms.
- `src/data/` contains structured listing data, content and contact configuration.
- `src/styles.css` holds design tokens, responsive layouts and motion rules. Tailwind provides the base styles and accessibility utilities.
- `public/photos/` contains local WebP images and an MP4 sample.
- `tests/` contains Playwright smoke tests for the production build.

## Prepare for Vercel

1. Push the project to a repository and import it into Vercel.
2. Select **Vite** as the framework preset. Use `npm run build` and `dist` for the output directory.
3. Add any confirmed public contact variables in the Vercel project settings before building.
4. Use the included `vercel.json` SPA rewrite so refreshing a profile route serves the app. [Vercel Vite SPA guide](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas)
5. On the Vercel preview URL, open a profile directly, refresh it, and test the contact links with the configured values.

The linked GitHub repository is private. Reviewers can use the public demo and the source archive, or receive repository access directly.

See the [test results](TESTING_CHECKLIST.md) and [AI usage log](AI_USAGE_LOG.md).


