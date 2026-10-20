// Keep the touch interface at its intended scale without intercepting a
// one-finger scroll, tap, text selection, or keyboard interaction.
export function installZoomGuard(target) {
  const preventPinch = (event) => {
    if (event.touches?.length > 1 && event.cancelable) event.preventDefault();
  };
  const preventGesture = (event) => {
    if (event.cancelable) event.preventDefault();
  };
  target.addEventListener("touchmove", preventPinch, { passive: false });
  target.addEventListener("gesturestart", preventGesture, { passive: false });
  target.addEventListener("gesturechange", preventGesture, { passive: false });
  return () => {
    target.removeEventListener("touchmove", preventPinch);
    target.removeEventListener("gesturestart", preventGesture);
    target.removeEventListener("gesturechange", preventGesture);
  };
}
