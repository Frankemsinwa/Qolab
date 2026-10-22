import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';

export type CurtainHandle = {
  /** Cover the screen, run `mid` (swap content), then uncover. */
  cover: (mid: () => void) => void;
};

/**
 * Full-screen curtain that wipes over the page during view changes.
 * Wipe up to cover, swap, wipe out from the top — cinematic but fast.
 */
const ViewCurtain = forwardRef<CurtainHandle>(function ViewCurtain(_props, ref) {
  const elRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useImperativeHandle(ref, () => ({
    cover(mid) {
      const el = elRef.current;
      if (!el || busy.current) {
        mid();
        return;
      }
      busy.current = true;
      gsap.timeline({
        onComplete: () => {
          busy.current = false;
          el.style.pointerEvents = 'none';
        },
      })
        .set(el, { pointerEvents: 'all', transformOrigin: 'bottom center', scaleY: 0 })
        .to(el, { scaleY: 1, duration: 0.4, ease: 'power3.inOut' })
        .add(() => mid())
        .set(el, { transformOrigin: 'top center' })
        .to(el, { scaleY: 0, duration: 0.5, ease: 'power3.inOut', delay: 0.08 });
    },
  }));

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] bg-[#0a0d0c] pointer-events-none"
      style={{ transform: 'scaleY(0)' }}
    />
  );
});

export default ViewCurtain;
