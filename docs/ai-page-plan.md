# AI Page Proposal: A New Horizon

**Status: Approved by the user and implemented. The user reviewed the visual result and requested a revision; see [the second visual proposal](ai-page-v2-plan.md).**

This document translates the user's visual idea and personal story into a concrete proposal. The user reviewed this proposal and approved implementation with “可以，开始实现吧” (“Yes, start implementing”). The original proposal and prompt are retained below as a record of the process.

## 1. Intended result

Replace the current interests page with an interactive story about my path into computer science. The page opens on a calm ocean at sunrise: a deep-blue sea, a peach-colored sky, a low sun, and a soft reflection on the water.

The left side contains a short first-person story. The right side shows one of three simple 3D objects. Five labeled milestone buttons let visitors move through the story at their own pace. The page should feel personal and thoughtful, with gentle movement and clear writing.

The visual style is deliberately stylized and low-poly. The ocean will suggest light and motion through a simple wave surface; it will not be a photorealistic fluid simulation.

```text
Chunzhang Liu                         Home | Work & Research | My Journey (AI)
----------------------------------------------------------------------------
                    A sunrise sky and ocean fill the background

   [Deep navy reading panel]                         [3D object]
   Chapter label                                  slowly turns
   Short heading                                  above the sea
   One personal paragraph

   [Curiosity] [Foundations] [A new direction] [Cloud & AI] [What comes next]
                                              [Pause motion]
----------------------------------------------------------------------------
AI-assisted page · Site source
```

On a phone, the reading panel appears above a smaller object area. The milestone buttons wrap onto multiple lines. Visitors can scroll normally.

## 2. Five chapters, exactly three object designs

| Chapter             | Story                                                                                                     | Object and visual treatment                                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Curiosity       | Early exposure to computers and a lasting interest in the field.                                          | **Object A: a retro desktop computer.** A small monitor, stand, and keyboard made from simple shapes, with a softly glowing screen.                                                                 |
| 1 — Foundations     | Switching majors, earning an Information Security bachelor's degree, and working on bank backend systems. | **Reuse Object A.** The same computer shows simple terminal-like lines and a small shield symbol on its screen. This is a variation of the existing model, not a fourth object.                     |
| 2 — A new direction | Leaving a stable job to study abroad and broaden career possibilities.                                    | **Object B: a globe with an orbital travel arc.** A stylized sphere with latitude/longitude lines and a small moving marker represents the move abroad. It does not require a detailed map texture. |
| 3 — Cloud & AI      | Cloud and security work at Nokia, alongside learning about AI.                                            | **Object C: a cloud infrastructure model.** A compact group of server blocks, cloud-like spheres, and connected nodes represents cloud systems, security, and AI.                                   |
| 4 — What comes next | Continuing to learn and exploring future opportunities.                                                   | **Reuse Object C.** The connected nodes spread slightly and the lighting becomes warmer, suggesting an open future without introducing another model.                                               |

Each object is one composed model that can contain several basic shapes. Only one model is displayed at a time. Objects stay on the right and do not overlap the reading panel.

## 3. Proposed English copy

The following paragraphs are drafts based on the user's description. No new qualifications, job offers, research results, or future commitments should be invented.

### 0 — Where it started

I was introduced to computers as a child, and I’ve been interested in them ever since. That early curiosity stayed with me and eventually led me toward computer science.

### 1 — Turning interest into a career

I switched majors and earned a bachelor’s degree in Information Security at Sichuan University. After graduation, I worked on backend systems at Shanghai Pudong Development Bank, where I learned how much care goes into software that people rely on every day.

### 2 — Choosing a new direction

I left a stable job to study abroad and pursue a master’s degree in Computer Science at Northeastern University. I wanted to broaden my perspective and explore more possibilities for my career.

### 3 — From backend systems to cloud and AI

At Nokia, I worked on cloud infrastructure and security, building on my experience with backend systems. Alongside that work, I’ve been learning about AI and the infrastructure needed to run it.

### 4 — What comes next

I want to keep learning and see where my experience in backend systems, cloud, security, and AI can take me. I’m open to new opportunities and to meeting people I can learn from.

## 4. Readability and interaction

- Use warm white text on a dark navy reading panel, with enough opacity to remain readable regardless of the ocean animation. Blur and text shadows must not be necessary for readability.
- Keep the sun and its brightest reflection toward the center-right. Avoid bright moving detail behind the text.
- Use a comfortable paragraph width of roughly 45–60 characters and a body size of at least 18 pixels on desktop, 16 pixels on mobile. Check normal text for at least 4.5:1 contrast.
- Keep the scene calm: slow waves, a gentle object turn, and short fades when switching chapters. No flashing effects, automatic chapter changes, or forced scrolling.
- Make the active milestone obvious. Use real buttons with visible keyboard focus and an active state; support both pointer and keyboard activation.
- Provide a Pause motion button. Start with motion paused when the visitor prefers reduced motion, and keep chapter selection functional.
- Keep all story text in HTML. If JavaScript or WebGL is unavailable, show the story with a static sunrise background rather than hiding the content.

## 5. Implementation after approval

**Recommended approach: native WebGL, HTML, CSS, and JavaScript ES modules.** WebGL is a browser graphics API that can render 3D into an HTML canvas. It does not require a backend or an external service. See the [MDN WebGL overview](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) and [WebGL tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial).

- Use one canvas for the ocean and active object, with ordinary HTML layered above it for the text and controls.
- Build the three models from simple boxes, spheres, and line geometry. Use a small wave surface, a gradient sky, and a sun glow for the background. Keep one simple lighting setup.
- Use a fixed camera, a mild object rotation, and a small set of reusable geometry and matrix helpers. A modest frame rate and capped canvas resolution are enough for this effect. Pause drawing when the page is hidden.
- Keep the visual code specific to the AI page. The shared stylesheet stays short, and the homepage and work-page interactions remain as they are.
- The page remains static and compatible with GitHub Pages. No build system, UI framework, external model downloads, or new npm dependency is planned.
- No external API call is needed for the proposed effect. Although the user permits APIs for this page, this proposal uses the browser's WebGL API only. It does not include a live AI chatbot or real-time text generation.

Native 3D rendering requires more JavaScript than the current static page. The tradeoff is a dependency-free implementation with simple shapes and lighting. If a later request calls for photorealistic water or detailed imported models, that would be a separate scope decision.

### Planned file changes

| File                      | Planned change                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ai.html`                 | Replace the current content with the five story chapters, scene canvas, milestone buttons, motion control, and a short AI note. |
| `css/ai.css`              | Add styles used only on this page: ocean fallback, reading panel, canvas placement, and mobile layout.                          |
| `js/ai.js`                | Add the scene renderer, three object definitions, chapter changes, and motion controls as one ES module.                        |
| `index.html`, `work.html` | Update only the shared navigation label from “Interests (AI)” to “My Journey (AI)”.                                             |
| `README.md`               | Record the prompt-and-review process now, then update implementation and review status after they actually happen.              |
| `docs/design.md`          | Update the description of the third page once the redesign is approved.                                                         |

## 6. Proposed implementation prompt

The following prompt was prepared before coding and used to guide implementation after the user approved this plan.

> Redesign only the AI page of Chunzhang Liu's personal homepage according to the approved `docs/ai-page-plan.md`. Create a calm, stylized sunrise-over-the-ocean scene. On desktop, place readable English story text on the left and a simple 3D object on the right. Put the text above a smaller object area on mobile. Use a dark navy reading panel and warm white text so the moving background never reduces readability.
>
> Use the five first-person paragraphs approved in the plan: childhood curiosity about computers; switching majors into Information Security and working on banking backend systems; leaving a stable job to study abroad; cloud and security work at Nokia while learning about AI; and an open-ended future. Do not invent personal details or achievements.
>
> Create exactly three composed 3D models: a retro computer for chapters 0 and 1, a globe with a travel arc for chapter 2, and a cloud/server/node model for chapters 3 and 4. Reuse the first and third models with small visual variations. Show one model at a time. Use low-poly geometry, gentle waves, a soft sunrise reflection, and slow object movement. Avoid photorealistic effects, elaborate transitions, and a large graphics framework.
>
> Implement this with native HTML5, CSS3, and JavaScript ES modules using WebGL. Keep the text in HTML and the graphics in one canvas. Add only `css/ai.css` and `js/ai.js` for the new implementation, and update `ai.html`. Change the AI navigation label on the other two pages to “My Journey (AI)” without redesigning those pages. No external API, backend, component library, new npm dependency, or build step is needed. The result must run on GitHub Pages.
>
> Let visitors select the five chapters with labeled native buttons. Include visible keyboard focus, an active state, a Pause motion control, and reduced-motion support. Preserve readable HTML content and a static sunrise fallback if the graphics cannot run. Keep the code organized into a few understandable functions and use comments only where they explain the graphics or chapter mapping.
>
> Verify desktop and mobile layout, text contrast, all chapter-to-object mappings, keyboard controls, motion pause, and the fallback. Update the README disclosure to describe what was actually generated and reviewed. Do not describe pending user approval as completed.

## 7. Review checkpoint

Before implementation, the user should confirm or revise:

1. The calm sunrise/ocean direction and the left-text/right-object layout.
2. The three model choices and their reuse across five chapters.
3. The five English paragraphs, especially the wording about leaving a stable job and future plans.
4. The stylized native-WebGL approach and the new “My Journey (AI)” navigation label.

**Approval record:** The user approved the plan before website implementation. The approved five story paragraphs, three model designs, sunrise scene, chapter controls, and motion/fallback behavior are now implemented. The two existing pages received only the agreed navigation-label change. This records approval of the proposal, not a claim that the user has completed a final review of the rendered page.

Implementation checks: five correct chapter-to-model mappings; desktop and mobile layouts; keyboard operation; pause/resume; simulated reduced-motion preference; all five paragraphs readable when JavaScript is absent or WebGL initialization fails. Main paragraph contrast is 13.44:1 against the solid reading panel. No external API or runtime dependency was added. The ocean uses a perspective-shaded procedural water plane rather than a fluid simulation.
