// HTML holds the content. This module only controls which stage is visible.
export function initJourney() {
  const controls = document.querySelector('.journey-controls');
  const entries = document.querySelector('.journey-entries');
  if (!controls || !entries) return;

  const buttons = [...controls.querySelectorAll('.journey-button')];
  const stages = [...entries.querySelectorAll('.journey-entry')];

  function selectStage(stageName) {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.stage === stageName));
    });
    stages.forEach((stage) => {
      stage.hidden = stage.dataset.stage !== stageName;
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => selectStage(button.dataset.stage));
  });
  entries.classList.add('enhanced');
  selectStage('cloud');
  controls.hidden = false;
}
