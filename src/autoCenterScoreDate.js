const centerSelectedScoreDate = () => {
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
