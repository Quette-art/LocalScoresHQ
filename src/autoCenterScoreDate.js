const addWeekdaysToScoreDates = () => {
  const buttons = document.querySelectorAll(".date-scroll .date-btn");
  const year = new Date().getFullYear();

  buttons.forEach((button) => {
    const label = button.textContent?.trim();
    if (!label) return;

    const parsed = new Date(`${label}, ${year}`);
    if (Number.isNaN(parsed.getTime())) return;

    button.dataset.weekday = parsed
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
  });
};

const ensureWeekdayStyles = () => {
  if (document.getElementById("score-date-weekday-styles")) return;

  const style = document.createElement("style");
  style.id = "score-date-weekday-styles";
  style.textContent = `
    .date-scroll .date-btn::before {
      content: attr(data-weekday);
      display: block;
      font-size: 0.72em;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.04em;
      margin-bottom: 5px;
      opacity: 0.78;
    }

    .date-scroll .date-btn.active::before {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
};

const centerSelectedScoreDate = () => {
  addWeekdaysToScoreDates();

  const dateScroll = document.querySelector(".date-scroll");
  const activeDate = dateScroll?.querySelector(".date-btn.active");

  if (!dateScroll || !activeDate) return;

  const targetLeft =
    activeDate.offsetLeft -
    (dateScroll.clientWidth - activeDate.clientWidth) / 2;

  dateScroll.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: "smooth",
  });
};

const scheduleCenter = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(centerSelectedScoreDate);
  });
};

if (typeof window !== "undefined") {
  ensureWeekdayStyles();
  window.addEventListener("DOMContentLoaded", scheduleCenter);

  const observer = new MutationObserver((mutations) => {
    const shouldCenter = mutations.some((mutation) => {
      if (mutation.type === "attributes") {
        return mutation.attributeName === "class";
      }

      return [...mutation.addedNodes].some(
        (node) =>
          node.nodeType === 1 &&
          (node.matches?.(".date-scroll, .date-btn") ||
            node.querySelector?.(".date-scroll, .date-btn"))
      );
    });

    if (shouldCenter) scheduleCenter();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest?.(".date-btn")) {
      setTimeout(scheduleCenter, 0);
    }
  });
}
