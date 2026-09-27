# Project 1 design document

Author: Chunzhang Liu

## Project description

A personal homepage showing my education, work at Nokia and SPDB, projects, publication, and patent. The goal is to help recruiters and professional contacts understand my background and get in touch.

Home summarizes my background. Work & Research gives project details and source links. My Journey is a separate AI-assisted visual story. The site uses native HTML, CSS, and JavaScript ES modules and is hosted on GitHub Pages. It does not require sign-in or collect visitor information.

The two main pages use a light background, dark text, red links, and straightforward headings. They prioritize facts over promotional copy. The interactive career timeline and project filters help visitors find information. The AI page has a separate visual style and its own stylesheet.

## User personas

These are intended visitor profiles, not accounts of user interviews.

| Visitor          | Context                                                 | Needs                                                                                 |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Recruiter / HR   | Opens a job application link and has limited time.      | Education, graduation date, work experience, relevant projects, and contact details.  |
| Course professor | Opens the submission to assess Project 1.               | Three pages, working interactions, source code, design document, and rubric evidence. |
| Classmate        | Looks for a teammate or wants to understand a project.  | Technologies, individual contributions, and repository links.                         |
| Colleague        | Follows a shared link after meeting or working with me. | A short introduction and an easy way to stay in touch.                                |

## User stories

- **Recruiter:** After receiving Chunzhang's application, I open his homepage. I want to quickly find his education and work history so I can decide whether to interview him.
- **Professor:** When reviewing Project 1, I visit all three pages and try the timeline, filters, and 3D controls. I want to check the assignment requirements and review the source.
- **Classmate:** While looking for a teammate, I read Chunzhang's project descriptions and open a repository. I want to understand his contributions and whether our skills fit the same project.
- **Colleague:** After following a shared link, I read the introduction and look for an email address so I can continue our conversation.

## Design mockups

These wireframes describe the page structure. Content is edited directly in HTML.

### Home — desktop

```text
Name                     Home | Work & Research | My Journey (AI)
----------------------------------------------------------------
Name / degree / short background / expected graduation
Projects | Email | GitHub | LinkedIn
----------------------------------------------------------------
Work experience
Nokia logo + role        Description and work details
SPDB logo + role         Description and work details
----------------------------------------------------------------
Education and career
2016–2020 | 2020–2024 | 2024–2026 | 2026
Selected education or work entry; courses in the graduate entry
----------------------------------------------------------------
Projects
DroneRanger              Climate Shield             LLM inference
----------------------------------------------------------------
Contact / Email
Footer / Source / LinkedIn
```

### Work & Research — desktop

```text
Shared navigation
Work & Research
----------------------------------------------------------------
All projects | Robotics | Climate tech | AI infrastructure
Project title / brief description / result
Contributions and details              Dates and technologies
Repository / paper or announcement
(repeat for each visible project)
----------------------------------------------------------------
Publication: title / authors / venue / DOI
Patent: number / title / record link
Contact / Email / Footer
```

### My Journey (AI) — desktop

```text
Shared navigation
Mountain sunrise / slowly drifting mist and petals
----------------------------------------------------------------
A new horizon                          Interactive 3D object
Selected personal story                Drag or use arrow keys
----------------------------------------------------------------
Curiosity | Foundations | A new direction | Cloud & AI | Future
Pause / Resume motion
Footer / AI disclosure / Source
```

The five chapters cover childhood curiosity, Information Security and banking, studying abroad, Nokia and AI, and future possibilities. Three objects illustrate them: a computer for chapters 0–1, a globe for chapter 2, and a cloud/server cluster for chapters 3–4. See [the reviewed AI-page plan and prompts](ai-page-v2-plan.md).

### Mobile layout

```text
Name
Home | Work & Research | My Journey (AI)
---------------------------------------
Introduction
---------------------------------------
Company logo / role
Experience details
---------------------------------------
Career buttons in two columns
Selected entry
---------------------------------------
Projects stacked vertically
---------------------------------------
Contact / Footer
```

Work-page project details stack above the dates and technologies. On the AI page, the story appears above the model and chapter buttons wrap. No content requires horizontal scrolling.

## Interaction and accessibility

- Use semantic headings, navigation, articles, links, and buttons.
- Use classes and data attributes for JavaScript selection; IDs connect headings, buttons, and section links.
- Timeline and filter buttons show their selection with `aria-pressed` and support keyboard activation.
- Include author/description metadata, a favicon, and alternative text for content images.
- Preserve every story and project when JavaScript is unavailable.
- On the AI page, maintain text contrast, provide Pause motion, and start paused for reduced-motion preference. If WebGL is unavailable, show all five story paragraphs.

## Implementation and checks

CSS, JavaScript, and images are in separate folders. `js/main.js` controls the timeline and project filters; `js/ai.js` handles the AI page. Flexbox provides the responsive column layout. There is no frontend library, backend, or build step. `scripts/serve.mjs` is only a local preview server.

ESLint and Prettier are development tools. The [rubric checklist](rubric.md) records the completed checks and remaining course submission items. The README includes setup instructions and the GenAI disclosure.
