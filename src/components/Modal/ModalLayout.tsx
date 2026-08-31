/**
 * @deprecated This component is deprecated in favor of Radix UI primitives.
 *
 * **For new code, use instead:**
 * - `Dialog` from `@/components/ui/dialog` for centered modals
 * - `DropdownMenu` from `@/components/ui/dropdown-menu` for anchored menus (like ProfileModal)
 *
 * **Benefits of Radix:**
 * - Built-in accessibility (focus trap, ARIA, keyboard nav)
 * - Better scroll lock and portal management
 * - Standard patterns and type safety
 * - Less custom code to maintain
 *
 * This file is kept for backward compatibility only.
 */

import {
  PropsWithChildren,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Close } from "@/assets/image";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
  onClose?: () => void;
  hasOverlay?: boolean;
  isProfileModal?: boolean;
  anchorRef?: RefObject<HTMLElement | null>;
  offsetY?: number;
  minWidthAnchor?: boolean;
}>;

/** @deprecated Use Dialog or DropdownMenu from Radix UI instead */
export default function ModalLayout({
  children,
  onClose,
  isProfileModal = false,
  anchorRef,
  offsetY = 10,
  minWidthAnchor = true,
}: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    minWidth?: number;
  }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (!isProfileModal || !anchorRef?.current) return;

    const calc = () => {
      const r = anchorRef.current!.getBoundingClientRect();
      setPos({
        top: r.bottom + offsetY,
        left: r.right,
        minWidth: minWidthAnchor ? r.width : undefined,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("scroll", calc, true);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("scroll", calc, true);
    };
  }, [isProfileModal, anchorRef, offsetY, minWidthAnchor]);

  useEffect(() => {
    if (!isProfileModal) return;
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      const inContent = contentRef.current?.contains(t);
      const inAnchor = anchorRef?.current?.contains(t);
      if (!inContent && !inAnchor) onClose?.();
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [isProfileModal, onClose, anchorRef]);

  return createPortal(
    <div
      className={
        isProfileModal
          ? "fixed inset-0 z-[999] pointer-events-none"
          : "fixed inset-0 z-[999]"
      }
    >
      {!isProfileModal && (
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      )}

      <div
        ref={contentRef}
        className={
          isProfileModal
            ? "absolute pointer-events-auto rounded-xl bg-bg-white shadow-2xl"
            : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-bg-white shadow-2xl"
        }
        style={
          isProfileModal
            ? {
                top: pos.top,
                left: pos.left,
                transform: "translateX(-100%)",
                minWidth: pos.minWidth ? `${pos.minWidth}px` : undefined,
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {!isProfileModal && (
          <button
            aria-label="close"
            className="absolute right-7 top-7 p-2 cursor-pointer"
            onClick={onClose}
          >
            <img src={Close} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
