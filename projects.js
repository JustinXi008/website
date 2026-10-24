const requestedDetails = new URLSearchParams(window.location.search).get("details");
const requestedPopover = requestedDetails ? document.getElementById(requestedDetails) : null;

const openProjectDetails = (popover) => {
  if (!popover?.matches("[popover]") || typeof popover.showPopover !== "function") return;

  popover.showPopover();
  popover.querySelector(".project-dialog-close")?.focus();
};

openProjectDetails(requestedPopover);

document.querySelectorAll("[data-project-details]").forEach((project) => {
  const openDetails = () => {
    const popover = document.getElementById(project.dataset.projectDetails);
    openProjectDetails(popover);
  };

  project.addEventListener("click", openDetails);
  project.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openDetails();
  });
});

// Keep the explanation and animation in the same project overlay.
const classifierDialog = document.getElementById("bag-of-words-details");
const classifierLaunch = document.getElementById("classifier-demo-launch");
const classifierBack = document.getElementById("classifier-demo-back");
const classifierDescription = document.getElementById("classifier-description-view");
const classifierDemo = document.getElementById("classifier-demo-view");
const classifierFrame = document.getElementById("classifier-demo-frame");
const classifierViewLabel = document.getElementById("classifier-view-label");

if (classifierDialog && classifierLaunch && classifierBack && classifierDescription && classifierDemo && classifierFrame && classifierViewLabel) {
  const showClassifierDescription = (restoreFocus = true) => {
    classifierDialog.classList.remove("is-classifier-demo");
    classifierDescription.hidden = false;
    classifierDemo.hidden = true;
    classifierBack.hidden = true;
    classifierLaunch.setAttribute("aria-expanded", "false");
    classifierDialog.setAttribute("aria-describedby", "bag-of-words-dialog-description");
    classifierViewLabel.textContent = "Project details";
    // Unload the frame so the animation stops when dismissed.
    classifierFrame.removeAttribute("src");
    classifierFrame.style.removeProperty("height");
    if (restoreFocus) classifierLaunch.focus();
  };

  classifierLaunch.addEventListener("click", () => {
    classifierDescription.hidden = true;
    classifierDemo.hidden = false;
    classifierBack.hidden = false;
    classifierLaunch.setAttribute("aria-expanded", "true");
    classifierDialog.setAttribute("aria-describedby", "classifier-demo-caption");
    classifierDialog.classList.add("is-classifier-demo");
    classifierViewLabel.textContent = "Interactive demo";
    classifierFrame.src = classifierFrame.dataset.src;
    classifierDialog.scrollTop = 0;
    classifierBack.focus();
  });

  classifierBack.addEventListener("click", () => showClassifierDescription());
  classifierDialog.addEventListener("toggle", (event) => {
    if (event.newState === "closed") showClassifierDescription(false);
  });

  // Checking the frame's Window also supports local file previews, where the
  // origin can be opaque. The child sends only its rendered height.
  window.addEventListener("message", (event) => {
    if (event.source !== classifierFrame.contentWindow || classifierDemo.hidden) return;
    const { type, height } = event.data || {};
    if (type !== "classifier:resize" || !Number.isFinite(height) || height < 200 || height > 3000) return;
    classifierFrame.style.height = `${Math.ceil(height)}px`;
  });
}
