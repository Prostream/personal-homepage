# Chunzhang Liu — Personal Homepage

- Author: Chunzhang Liu
- Website: https://prostream.github.io/personal-homepage/
- Course link: TO ADD
- Goal: introduce my education, experience and projects for job searching and networking.
- [Design document and mockups](docs/design.md)
- License: MIT

![Homepage](docs/screenshots/home.png)

## Pages

- `index.html`: introduction, Nokia and SPDB experience, career journey, contact.
- `work.html`: DroneRanger, Climate Shield, LLM inference, publication and patent.
- `ai.html`: My Journey (AI), five personal chapters, an animated mountain sunrise, and three draggable native 3D models.

## Run and edit

This is a static website with native HTML, CSS and JavaScript. There is no build step or frontend library.

With Node.js installed, run:

```sh
npm run dev
```

Open http://127.0.0.1:4173. No `npm install` is needed to view the site. The small script in `scripts/` is only a local preview server; GitHub Pages hosts the actual website.

Edit the HTML files to change text, `css/styles.css` to change the appearance, and `js/main.js` to change the career journey or project filters. Images go in `images/`.

The AI page is separate: edit `css/ai.css` for its layout and atmosphere, or `js/ai.js` for the three models and movement. Its background is `images/mountain-sunrise-v2.png`. Drag a model or use the arrow keys while it is focused; Home resets its orientation. Pause motion freezes the background and models while keeping chapter selection available.

Prettier is optional for editing. To format the files, run `npm install` and then `npm run format`. This creates a local `node_modules` folder containing development tools; the website does not use it, and Git ignores it.

Push changes to `codex/personal-homepage` to update GitHub Pages.

## Assignment notes

ESLint configuration has been removed in this simplified version, so that rubric item is not currently met. The course link, narrated demo video and course code review still need to be completed.

## Use of generative AI

I used OpenAI Codex to help develop this website and plan a redesign of its AI page. The session identifies the model family as GPT-6; the exact model snapshot/version is not available. AI assistance has also been used on the other pages, styling, JavaScript, and documentation.

For the AI-page redesign, I described the effect I wanted: a sunrise over the ocean, readable text on the left, and three 3D objects on the right that relate to my experiences. I provided the story outline, from an early interest in computers through Information Security, banking backend work, studying abroad, Nokia, learning about AI, and future possibilities.

Instead of asking the AI to immediately write the page, I asked it to first prepare an English Markdown proposal. [The AI-page plan](docs/ai-page-plan.md) explains the visual design, draft text, object choices, interactions, technical approach, planned file changes, and proposed implementation prompt. This lets me understand what would be built and check whether it matches my requirements before approving implementation. I reviewed the proposal and authorized implementation with “可以，开始实现吧” (“Yes, start implementing”). The approved plan then guided the implementation. This approval covered the plan; it does not imply that I have reviewed every detail of the finished page.

The first implementation used native WebGL for an ocean shader and three composed models, with page styling and chapter/motion controls in `ai.html`, `css/ai.css`, and `js/ai.js`. I provided the personal facts and approved the English story draft. The computer illustrates the first two chapters, the globe represents studying abroad, and the cloud/server model covers the final two chapters.

After reviewing the first visual result, I asked for a Japanese animation-inspired mountain sunrise and more expressive twisting and wiggling objects. The [second visual proposal](docs/ai-page-v2-plan.md) records that feedback, the background-generation prompt, three motion designs, and the revised implementation prompt. Codex used the built-in image-generation tool to produce the landscape; the exact image-model version was not reported by the tool. The Markdown document let me review the appearance and planned behavior before website changes.

I then provided [Sunseto](https://sunset.mengto.here.now/) as a visual reference and clarified that the background subject is flexible as long as it is animated. Codex inspected its drifting petals and draggable solar-panel object and updated the proposal toward ambient background motion, warm lighting, and restrained drag/tilt/spring interaction. I approved that direction with “ok 实现吧” (“OK, implement it”). The reference was used for visual direction, without copying its assets or code.

The revised page now uses the generated mountain image locally, CSS mist, Canvas 2D petals, and three native WebGL models with rounded edges, smooth shading, drag rotation, arrow-key controls, and spring settling. It has no new runtime dependencies, backend, or external API requests. AI assisted with the illustration, implementation, and documentation; I supplied the facts, reference, feedback, and approvals. Browser checks covered five chapter mappings, responsive widths from 320 to 1440 pixels, mouse/keyboard interaction, pause/resume, simulated reduced motion, and readable fallbacks. W3C validation reported zero HTML errors or warnings. Approval of the proposal does not mean I have reviewed every detail of the finished code.
