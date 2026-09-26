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
- `ai.html`: the third, AI-generated page required by the assignment.

## Run and edit

This is a static website with native HTML, CSS and JavaScript. There is no build step or frontend library.

With Node.js installed, run:

```sh
npm run dev
```

Open http://127.0.0.1:4173. No `npm install` is needed to view the site. The small script in `scripts/` is only a local preview server; GitHub Pages hosts the actual website.

Edit the HTML files to change text, `css/styles.css` to change the appearance, and `js/main.js` to change the career journey or project filters. Images go in `images/`.

Prettier is optional for editing. To format the files, run `npm install` and then `npm run format`. This creates a local `node_modules` folder containing development tools; the website does not use it, and Git ignores it.

Push changes to `codex/personal-homepage` to update GitHub Pages.

## Assignment notes

ESLint configuration has been removed in this simplified version, so that rubric item is not currently met. The course link, narrated demo video and course code review still need to be completed.

## Use of generative AI
