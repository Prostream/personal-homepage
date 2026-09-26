# Project 1 design document

Author: Chunzhang Liu

## Project description

A personal homepage that introduces my education, experience at Nokia and SPDB, projects, publication and patent. Its goal is to help recruiters and professional contacts understand my background quickly and get in touch.

The site uses HTML, CSS and a JavaScript ES module. It has three pages, a simple career journey, and project filters. The design uses a light background, dark text, red links, and a single mobile breakpoint.

## User personas and stories

| Visitor          | Goal                             | User story                                                                                                                                             |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recruiter / HR   | Check my background for a role   | As a recruiter opening my application link, I want to quickly read my education and experience so I can decide whether my background matches the role. |
| Course professor | Evaluate Project 1               | As the professor opening my submission, I want to visit each page and try the interactions so I can check the Project 1 requirements.                  |
| Classmate        | Find a potential teammate        | As a classmate, I want to see my projects and technologies so I can decide whether we could work together.                                             |
| Colleague        | Learn about me and stay in touch | As a colleague following a shared link, I want a quick introduction and contact details so we can stay in touch.                                       |

## Page mockups

These simple wireframes describe the current layout. All pages share the navigation and footer.

### Home

```text
Name                       Home | Work & Research | Interests (AI)
------------------------------------------------------------------
Introduction and expected graduation
Work link / Email / GitHub / LinkedIn
------------------------------------------------------------------
Nokia logo + role          Experience description
SPDB logo + role           Experience description
------------------------------------------------------------------
Career journey: Security | Banking | Graduate study | Cloud & AI
Selected story (graduate study introduces relevant courses)
------------------------------------------------------------------
DroneRanger          Climate Shield          LLM inference
------------------------------------------------------------------
Let's connect — Feel free to reach out!       Email
Footer / Source / LinkedIn
```

### Work & Research

```text
Shared navigation
Page introduction
All projects | Robotics | Climate tech | AI infrastructure
Project description                 Technology and dates
Repository / evidence links
(repeat for each visible project)
Publication: title, authors, venue, DOI
Patent: number and title
Contact and footer
```

### Interests (AI)

```text
Shared navigation
Introduction + AI-generated page note
01  Backend systems
02  AI infrastructure
03  Autonomous systems
About this page
Footer
```

On phones, work experience and project columns stack vertically, navigation wraps, and journey buttons form two columns. Native links and buttons support keyboard use. Selected controls use `aria-pressed`; images have alternative text. Without JavaScript, every project and journey story remains readable.

## Files and checks

Content is edited in the three HTML files. CSS, JavaScript and images have separate folders. The career journey and project filters share `js/main.js`. GitHub Pages hosts the static files without a build step. `scripts/serve.mjs` is only for local preview.

Check the pages on desktop and mobile, try each interaction, and check the HTML with W3C Validator. This simplified version does not include ESLint configuration. The README has the remaining course notes.
