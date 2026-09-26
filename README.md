# Chunzhang Liu — Personal Homepage

A simple personal homepage for Project 1, built with HTML5, CSS3, and JavaScript ES modules. It introduces my education, experience at Nokia and SPDB, selected projects, publication, and patent to support job searching and professional networking.

- **Author:** Chunzhang Liu
- **Live website:** https://prostream.github.io/personal-homepage/
- **Course link:** TO ADD — the course homepage URL has not been supplied. This belongs in the README and does not need to appear on the public homepage.
- **Design document:** [Project description, personas, stories, and mockups](docs/design.md)
- **Submission checklist and video outline:** [Submission guide](docs/submission.md)
- **License:** [MIT](LICENSE)

![Homepage screenshot](docs/screenshots/home.png)

## Pages and original features

| Page                                                                       | Contents                                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Home](https://prostream.github.io/personal-homepage/index.html)           | Introduction, work experience, interactive education/career journey, project highlights, contact links |
| [Work & Research](https://prostream.github.io/personal-homepage/work.html) | Three projects, topic filters, DroneRanger publication, patent                                         |
| [Interests (AI)](https://prostream.github.io/personal-homepage/ai.html)    | A clearly labeled third, AI-generated page describing interests grounded in the supplied experience    |

The original creative feature is a four-stage **learning and career journey**. Native buttons reveal the corresponding story and update their pressed state. A second original JavaScript feature filters projects by topic and announces the visible count. The content stays readable when JavaScript is unavailable. Both features are implemented with more than five lines of original JavaScript; no UI library is used.

## Run locally

Use Node.js **20.19 or later** and npm. The website itself has no runtime dependencies and no build step.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Use a local HTTP server instead of opening HTML through `file://`, because the JavaScript uses ES modules. `scripts/serve.mjs` is a development tool only; GitHub Pages serves the production site as static files.

```sh
npm run format       # Apply Prettier
npm run check        # Check formatting and ESLint
```

Development dependencies are listed in `package.json` and pinned in `package-lock.json`. No React, jQuery, Bootstrap, bundler, backend, or component library is required.

## Where to edit

| What you want to change                                            | File                                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| Name, introduction, education, career journey, experience, contact | `index.html`                                          |
| Projects, publication, patent                                      | `work.html`                                           |
| Third page and its AI disclosure                                   | `ai.html`                                             |
| Colors, typography, spacing, mobile layout                         | `css/styles.css`; start with the variables at the top |
| Timeline behavior                                                  | `js/journey.js`                                       |
| Project filtering                                                  | `js/projects.js`                                      |
| Icons and illustrations                                            | `images/`                                             |
| Design rationale, mockups, submission notes                        | `docs/`                                               |

Most content lives directly in HTML, so editing text does not require understanding JavaScript. Keep the `data-stage` values on journey buttons and entries in sync. Keep each project's `data-category` consistent with its filter button. Navigation and footers are repeated in all three HTML files for simplicity; update all three if they change. Use relative internal links so the site works under the GitHub Pages repository subpath.

## Deployment

GitHub Pages publishes the root directory of the `codex/personal-homepage` branch. There is no build command. After editing and checking the files, commit and push to that branch; GitHub Pages republishes the site. `.nojekyll` keeps this a plain static site.

In repository **Settings → Pages**, the source is **Deploy from a branch**, branch **codex/personal-homepage**, folder **/ (root)**.

## Quality and course requirements

- Semantic HTML, native buttons and links, class-based styling/JavaScript selectors, descriptive image alternatives, author/description metadata, and a favicon.
- CSS uses Flexbox for layout, responsive breakpoints, visible keyboard focus, and no `!important`.
- All JavaScript loads through `type="module"`; `package.json` also specifies `"type": "module"`.
- ESLint currently uses the recommended configuration. **The class-specific ESLint configuration has not been supplied.** Replace or merge it when the instructor provides it, then rerun the checks. W3C Validator checks HTML; it is not an ESLint configuration.
- See [validation notes](docs/validation.md) for checks actually performed and outstanding items.

## Content sources

Experience and education were adapted from the author's supplied resume and career notes. Only selected professional information is included; the source resume files are not bundled.

- [DroneRanger repository](https://github.com/Prostream/DroneRanger) and [published paper DOI](https://doi.org/10.1109/CCWC67433.2026.11393823).
- [Climate Shield repository](https://github.com/Prostream/Climate-Shield) and [author's award announcement](https://www.linkedin.com/posts/chunzhangliu_thrilled-to-share-that-our-team-won-first-activity-7257917516184797186-lrux). This is described as a team project; no unsupported individual leadership claim is added.
- [LLM inference repository](https://github.com/Prostream/llm-inference-on-k8s). Descriptions cover documented engineering experiments; unfinished benchmark tables are not presented as measured results.
- Patent number and English title supplied by the author: **CN114091586**, _Account identification model determination method and device, equipment and medium_. No grant-status claim is made.
- Initials illustration and favicon are simple SVG artwork created for this site.

## Use of generative AI
