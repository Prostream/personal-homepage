# Project 1 submission guide

## Final items for the author

- [ ] Read the published site and confirm the professional wording is accurate.
- [ ] Add the actual **course homepage link** near the top of `README.md`.
- [ ] Obtain the class ESLint configuration if one exists. The current recommended configuration is provisional.
- [ ] Complete the currently empty GenAI disclosure section in the README before submission.
- [ ] Record a short **public, narrated** demonstration and add its URL below.
- [ ] Complete the course's required **code review** according to the instructor's instructions.
- [ ] Submit the live website URL in the assignment and complete the required Google Form. Check thumbnail visibility and every submitted link.
- [ ] Check that the instructor can open the design document, website, repository, and video.

**Demo video:** TO ADD — a narration outline is provided below; no recorded video has been created.

## Suggested 90–120 second narration

**0:00–0:20 — Purpose and home**

“This is my personal homepage for Project 1. It introduces my education, work experience, and projects to support job searching and networking. The homepage gives visitors a short introduction and shows my work at Nokia and SPDB.”

**0:20–0:40 — Original interaction**

Click the career-journey buttons.

“I added an interactive journey showing how my interests developed from information security to banking systems and cloud infrastructure. These are native buttons, and the behavior is implemented with JavaScript ES modules.”

**0:40–1:00 — Projects and evidence**

Open Work & Research and try two filters, then All.

“This page introduces DroneRanger, Climate Shield, and my LLM inference project. Visitors can filter by topic and open the repositories. The page also includes my publication and patent.”

**1:00–1:20 — Third page and phone layout**

Open Interests (AI), then show the narrow-screen layout.

“The third page is explicitly labeled as AI-generated. The site uses plain HTML and CSS with responsive Flexbox layouts, and the essential information remains available without JavaScript.”

**1:20–1:40 — Repository and disclosure**

Open the repository README and briefly show the folders.

“The README includes setup instructions, the design document, screenshots, and a disclosure of AI assistance across the project. CSS, JavaScript, and images are organized separately. The site is deployed publicly on GitHub Pages.”

## Rubric mapping

| Requirement                                                   | Evidence / remaining action                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Design document: description, personas, stories, mockups (80) | `docs/design.md`, `docs/mockups/`                                   |
| Meaningful personal homepage (15)                             | Education, Nokia/SPDB, three projects, publication, patent, contact |
| ES6 modules (5)                                               | `js/main.js`, module script tags, package type                      |
| Original component (5)                                        | Four-stage career journey                                           |
| Public deployment (5)                                         | GitHub Pages                                                        |
| Organized resources (5)                                       | `css/`, `js/`, `images/`, `docs/`                                   |
| Author, description, icon (5)                                 | Every page's head                                                   |
| Original JavaScript >5 lines (5)                              | `js/journey.js`, `js/projects.js`                                   |
| Prettier (5)                                                  | `npm run format:check`                                              |
| W3C HTML validity (5)                                         | See `docs/validation.md`                                            |
| Class ESLint config (5)                                       | Recommended config works; actual class config still needed          |
| Image alt text (5)                                            | Homepage monogram                                                   |
| Two pages plus third AI page (5)                              | `index.html`, `work.html`, `ai.html`                                |
| Classes identify elements (5)                                 | CSS selectors and JS queries                                        |
| Standard tags (5)                                             | Native `button`, `a`, semantic sections                             |
| Organized CSS, no !important (5)                              | `css/styles.css`                                                    |
| Layout grid / Flexbox (5)                                     | Flexbox desktop and mobile layouts                                  |
| README (5)                                                    | Author, objective, screenshot, setup; **course URL still needed**   |
| package.json (5)                                              | Tooling dependencies and scripts                                    |
| MIT license (5)                                               | `LICENSE`                                                           |
| Public narrated demo (15)                                     | **Author must record and publish**                                  |
| Google Form submission (5)                                    | **Author must submit**                                              |
| GenAI disclosure (10)                                         | README section is blank; complete before submission                 |
| Code review (20)                                              | **Author must complete course process**                             |
