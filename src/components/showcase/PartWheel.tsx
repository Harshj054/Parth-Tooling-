import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShowcasePart } from "@/data/parts";

/**
 * Vertical wheel picker — the user scrolls a curved, iOS-style column and the
 * part that settles in the centre "selection window" is loaded into the forge.
 * Rows tilt back and fade with distance from centre (a real wheel read), snap
 * to centre, and are reachable by scroll, drag, click, chevrons or arrow keys.
 * Height is fluid: it fills its column (measured at runtime) so it can stand as
 * a tall rail next to the 3D viewer.
 */
const ROW_H = 78;

export function PartWheel({
  parts,
  selectedId,
  onSelect,
}: {
  parts: ShowcasePart[];
  selectedId: string;
  onSelect: (part: ShowcasePart) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const raf = useRef<number>();
  const settle = useRef<number>();
  const [pad, setPad] = useState(140); // top/bottom spacer so ends can centre
  const [center, setCenter] = useState(() =>
    Math.max(
      0,
      parts.findIndex((p) => p.id === selectedId),
    ),
  );

  const rowEls = () =>
    Array.from(
      scroller.current?.querySelectorAll<HTMLElement>("[data-row]") ?? [],
    );

  // Curve + fade every row by its distance from the wheel centre.
  const paint = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const mid = el.scrollTop + el.clientHeight / 2;
    let nearest = 0;
    let best = Infinity;
    rowEls().forEach((row, i) => {
      const d = (row.offsetTop + row.offsetHeight / 2 - mid) / ROW_H;
      const ad = Math.abs(d);
      row.style.transform = `perspective(680px) rotateX(${Math.max(-74, Math.min(74, d * -24))}deg) translateZ(${-ad * 16}px)`;
      row.style.opacity = String(Math.max(0.14, 1 - ad * 0.3));
      if (ad < best) {
        best = ad;
        nearest = i;
      }
    });
    setCenter(nearest);
  }, []);

  const nearestIndex = useCallback(() => {
    const el = scroller.current;
    if (!el) return 0;
    const mid = el.scrollTop + el.clientHeight / 2;
    let nearest = 0;
    let best = Infinity;
    rowEls().forEach((row, i) => {
      const ad = Math.abs(row.offsetTop + row.offsetHeight / 2 - mid);
      if (ad < best) {
        best = ad;
        nearest = i;
      }
    });
    return nearest;
  }, []);

  const centerOn = useCallback(
    (i: number, smooth: boolean) => {
      const el = scroller.current;
      const row = rowEls()[Math.max(0, Math.min(parts.length - 1, i))];
      if (!el || !row) return;
      el.scrollTo({
        top: row.offsetTop + row.offsetHeight / 2 - el.clientHeight / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [parts.length],
  );

  const onScroll = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(paint);
    // Commit the centred part once scrolling settles (avoids remount thrash).
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const part = parts[nearestIndex()];
      if (part && part.id !== selectedId) onSelect(part);
    }, 150);
  }, [paint, nearestIndex, parts, selectedId, onSelect]);

  const pick = useCallback(
    (i: number) => {
      centerOn(i, true);
      const part = parts[Math.max(0, Math.min(parts.length - 1, i))];
      if (part && part.id !== selectedId) onSelect(part);
    },
    [centerOn, parts, selectedId, onSelect],
  );

  // Measure the wheel height → spacer size; keep it correct across resizes.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setPad(Math.max(0, (el.clientHeight - ROW_H) / 2)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When the spacer (height) settles, recentre on the selected part and repaint.
  useLayoutEffect(() => {
    const i = parts.findIndex((p) => p.id === selectedId);
    centerOn(i < 0 ? 0 : i, false);
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad]);

  useEffect(() => () => window.clearTimeout(settle.current), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      pick(nearestIndex() + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      pick(nearestIndex() - 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <span className="mb-3 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-faint">
        <span className="h-1.5 w-1.5 rotate-45 bg-arc/70" aria-hidden="true" />
        Select part
        <span className="ml-auto tabular-nums text-arc">
          {String(center + 1).padStart(2, "0")}{" "}
          <span className="text-faint">
            / {String(parts.length).padStart(2, "0")}
          </span>
        </span>
      </span>

      <div className="relative min-h-0 flex-1 rounded-2xl border border-line bg-panel/40">
        {/* centre selection window */}
        <div
          className="pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-xl border-y border-arc/40 bg-arc/[0.06]"
          style={{ height: ROW_H }}
          aria-hidden="true"
        />

        {/* the wheel */}
        <div
          ref={scroller}
          role="listbox"
          aria-label="Choose a part to forge"
          tabIndex={0}
          data-lenis-prevent
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          className="absolute inset-0 overflow-y-auto overscroll-contain scroll-smooth rounded-2xl outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-arc/60 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: "y mandatory",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          }}
        >
          <div style={{ height: pad }} aria-hidden="true" />
          {parts.map((p, i) => {
            const active = i === center;
            return (
              <button
                key={p.id}
                data-row
                type="button"
                role="option"
                aria-selected={p.id === selectedId}
                onClick={() => pick(i)}
                className="flex w-full flex-col justify-center px-5 text-left will-change-transform"
                style={{ height: ROW_H, scrollSnapAlign: "center" }}
              >
                <span className="flex items-center gap-2">
                  <span className="truncate font-mono text-[0.52rem] uppercase tracking-[0.18em] text-faint">
                    {p.category}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[0.48rem] uppercase tracking-[0.14em]",
                      p.model ? "text-arc" : "text-faint",
                    )}
                  >
                    {p.model ? "· 3D" : "· Soon"}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate font-display text-lg font-bold leading-tight tracking-tightest transition-colors",
                    active ? "text-fg" : "text-muted",
                  )}
                >
                  {p.name}
                </span>
                <span className="truncate font-mono text-[0.56rem] text-faint">
                  {p.material}
                </span>
              </button>
            );
          })}
          <div style={{ height: pad }} aria-hidden="true" />
        </div>

        {/* chevron affordances */}
        <button
          type="button"
          onClick={() => pick(nearestIndex() - 1)}
          aria-label="Previous part"
          className="absolute left-1/2 top-1.5 z-20 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full text-faint transition-colors hover:text-arc"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => pick(nearestIndex() + 1)}
          aria-label="Next part"
          className="absolute bottom-1.5 left-1/2 z-20 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full text-faint transition-colors hover:text-arc"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
