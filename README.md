# Chunzhang Liu — Personal Homepage

- Author: Chunzhang Liu
- Website: https://prostream.github.io/personal-homepage/
- Course: [CS 5610 Web Development, Fall 2026](https://johnguerra.co/classes/webDevelopment_online_fall_2026/index.html)
- Goal: introduce my education, experience and projects for job searching and networking.
- [Design document and mockups](docs/design.md)
- [Design document slides](https://docs.google.com/presentation/d/1HsvbdmB9rf6omnEecEpRZbJb1_QLXM8qD5-E40Muh4M/edit)
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

For the assignment checks, use Node.js 20.19 or later:

```sh
npm install
npm run format
npm run check
```

`check` runs ESLint and Prettier. These are development tools only; the website has no runtime dependencies. The local `node_modules` folder is ignored by Git and is not needed to view the website.

Push changes to `codex/personal-homepage` to update GitHub Pages.

## Assignment notes

- [Rubric checklist](docs/rubric.md)
- Public narrated video: [Watch the project demo on YouTube](https://www.youtube.com/watch?v=vjmPlJ4CS5g&t=7s)
- Google Form submission:
- Course code review: pending.

`eslint.config.js` is the class configuration downloaded from Slack, with formatting changes only. The Prettier settings in `package.json` match its formatting rules. `npm run check` passes: ESLint reports no errors or warnings, and Prettier formatting passes.

## Use of generative AI

I used OpenAI Codex (GPT-6 family; exact version unavailable) to assist with HTML, CSS, JavaScript, and documentation. Its built-in image tool generated the landscape background; the image-model version was not provided.

I supplied my personal background and requested a five-chapter story with readable text and three interactive 3D objects. Codex drafted English Markdown plans for me to review before implementation. We then refined the page through my feedback and browser checks. The prompts and design decisions are recorded in the [initial plan](docs/ai-page-plan.md) and [revised plan](docs/ai-page-v2-plan.md).

[Sunseto](https://sunset.mengto.here.now/) inspired the warm landscape, drifting petals, and draggable objects. The final page uses native HTML, CSS, JavaScript, and WebGL with a local AI-generated image.
