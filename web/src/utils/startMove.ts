export function startMove(
  e: MouseEvent | TouchEvent,
  div: HTMLDivElement | null,
  onMove: (dx: number, dy: number) => void,
  onEnd?: () => void,
  includeScrollOffsets: boolean = true
) {
  if (!div) return;
  e.preventDefault();

  const rect = div.getBoundingClientRect();

  const getLocalPos = (ev: MouseEvent | TouchEvent) => {
    const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
    const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
    return {
      x: clientX - rect.left + (includeScrollOffsets ? div.scrollLeft : 0),
      y: clientY - rect.top + (includeScrollOffsets ? div.scrollTop : 0),
    };
  };

  const startPos = getLocalPos(e);

  function handleMove(ev: MouseEvent | TouchEvent) {
    const pos = getLocalPos(ev)
    const dx = pos.x - startPos.x;
    const dy = pos.y - startPos.y;
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
