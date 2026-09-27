// HTML holds the content. This module only controls which stage is visible.
function initJourney() {
  const controls = document.querySelector(".journey-controls");
  const entries = document.querySelector(".journey-entries");
  if (!controls || !entries) return;

  const buttons = [...controls.querySelectorAll(".journey-button")];
  const stages = [...entries.querySelectorAll(".journey-entry")];

  function selectStage(stageName) {
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.stage === stageName)
      );
    });
    stages.forEach((stage) => {
      stage.hidden = stage.dataset.stage !== stageName;
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectStage(button.dataset.stage));
  });
  selectStage("cloud");
  controls.hidden = false;
}

function initProjectFilters() {
  const controls = document.querySelector(".project-filters");
  const status = document.querySelector(".filter-status");
  if (!controls || !status) return;

  const buttons = [...controls.querySelectorAll(".filter-button")];
  const projects = [...document.querySelectorAll(".project")];

  function filterProjects(category) {
    let count = 0;
    projects.forEach((project) => {
      const visible =
        category === "all" || project.dataset.category === category;
      project.hidden = !visible;
      if (visible) count += 1;
    });
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === category)
      );
    });
    status.textContent =
      category === "all"
        ? `Showing all ${count} projects.`
        : `Showing ${count} of ${projects.length} projects.`;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () =>
      filterProjects(button.dataset.filter)
    );
  });

  // A direct link to a project must work even after another filter was selected.
  function revealLinkedProject() {
    const project = projects.find(
      (item) => `#${item.id}` === window.location.hash
    );
    if (!project) return;
    filterProjects("all");
    project.scrollIntoView({ block: "start" });
  }

  filterProjects("all");
  controls.hidden = false;
  status.hidden = false;
  window.addEventListener("hashchange", revealLinkedProject);
  revealLinkedProject();
}

initJourney();
initProjectFilters();
