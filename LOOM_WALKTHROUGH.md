# Loom walkthrough

Recording outline for a six- to eight-minute walkthrough. Start with the [live Vercel demo](https://teddypups-assessment.vercel.app/).

1. Open the home page and the assignment brief. Explain that the deliverable reproduces the catalog and enquiry workflows with a distinct editorial presentation. Point out the illustrative media label. Scroll through the home page to show the companion, moving catalog preview, travel cue and resting pose in the footer.
2. Show the reference route inventory and the rendered profile data. Explain that the main routes were available as public HTML and that profile details appeared after hydration in Chrome.
3. Open the catalog, change a breed or location filter, and show the query string. Open Max, switch between photos and the sample video, then open the next profile.
4. Open the family gallery, navigate with the arrow keys, and close with Escape. Show the nine-question FAQ, search for a question and expand the answer.
5. Show the contact page and trigger a required-field error. Enter sample data, select a puppy and prepare an email draft. Point out that the visitor sends it in their email app and that the demo has no verified recipient.
6. Inspect a narrow viewport and demonstrate the mobile menu and delivery deep link. Open `src/components`, `src/data` and `src/styles.css` to explain component reuse, the local media set and design tokens.
7. Show [AI_USAGE_LOG.md](AI_USAGE_LOG.md) for the prompts and explain how Codex, ImageGen, Chrome, and Playwright were used. Show the production build and automated results. Close by opening a puppy profile directly on Vercel and refreshing it.
