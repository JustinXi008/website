// Preserve existing details links while moving featured work to dedicated pages.
const requestedDetails = new URLSearchParams(window.location.search).get("details");
const projectPages = {
  "apriltag-odometry-details": "projects/apriltag-odometry-verification-system.html",
  "bag-of-words-details": "projects/post-text-classifier.html",
};
if (Object.hasOwn(projectPages, requestedDetails)) {
  window.location.replace(projectPages[requestedDetails]);
}

const openProjectDetails = (popover) => {
  if (!popover?.matches("[popover]") || typeof popover.showPopover !== "function") return;
  popover.showPopover();
  popover.querySelector(".project-dialog-close")?.focus();
};
openProjectDetails(requestedDetails ? document.getElementById(requestedDetails) : null);

document.querySelectorAll("[data-project-details]").forEach((project) => {
  const openDetails = () => openProjectDetails(document.getElementById(project.dataset.projectDetails));
  project.addEventListener("click", openDetails);
  project.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openDetails();
  });
});

// Fit the full animation to its content, including its stacked mobile layout.
const bstFrame = document.querySelector("[data-bst-frame]");
if (bstFrame) {
  window.addEventListener("message", (event) => {
    if (event.source !== bstFrame.contentWindow) return;
    const { type, height } = event.data || {};
    if (type !== "bst:resize" || !Number.isFinite(height) || height < 200 || height > 3000) return;
    bstFrame.style.height = `${Math.ceil(height)}px`;
  });
}

const classifierFrame = document.querySelector("[data-classifier-frame]");
if (classifierFrame) {
  window.addEventListener("message", (event) => {
    if (event.source !== classifierFrame.contentWindow) return;
    const { type, height } = event.data || {};
    if (type !== "classifier:resize" || !Number.isFinite(height) || height < 200 || height > 3000) return;
    classifierFrame.style.height = `${Math.ceil(height)}px`;
  });
}

const previewFrame = document.querySelector("[data-classifier-preview]");
const previewToggle = document.querySelector("[data-preview-toggle]");
if (previewFrame && previewToggle) {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const setPaused = (paused) => {
    previewToggle.setAttribute("aria-pressed", String(paused));
    previewToggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} classifier preview`);
    previewToggle.textContent = paused ? "Play" : "Pause";
    previewFrame.contentWindow?.postMessage({ type: "classifier:pause", paused }, "*");
  };
  previewToggle.addEventListener("click", () => setPaused(previewToggle.getAttribute("aria-pressed") !== "true"));
  previewFrame.addEventListener("load", () => setPaused(motionPreference.matches));
  motionPreference.addEventListener("change", (event) => setPaused(event.matches));
  setPaused(motionPreference.matches);
}
