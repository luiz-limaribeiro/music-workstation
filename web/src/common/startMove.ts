export function startMove(
  e: MouseEvent | TouchEvent,
  div: HTMLDivElement | null,
  onMove: (dx: number, dy: number) => void,
  onEnd?: () => void
) {
  e.preventDefault();

  const rect = div?.getBoundingClientRect()
  const startX = "touches" in e ? e.touches[0].clientX : e.clientX - (rect?.left ?? 0);
  const startY = "touches" in e ? e.touches[0].clientY : e.clientY - (rect?.top ?? 0);

  function handleMove(ev: MouseEvent | TouchEvent) {
    const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX - (rect?.left ?? 0);
    const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY - (rect?.top ?? 0);
    const dx = clientX - startX;
    const dy = clientY - startY;
    onMove(dx, dy);
  }

  function handleUp() {
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleUp);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleUp);
    onEnd?.();
  }

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleUp);
  document.addEventListener("touchmove", handleMove);
  document.addEventListener("touchend", handleUp);
}
