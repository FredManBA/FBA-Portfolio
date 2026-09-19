import { useEffect, type RefObject } from 'react';
import { trapFocus } from '../utils/focus';

const APP_ROOT_ID = 'root';

interface ModalBehaviorOptions {
  /** False while the modal plays its exit animation: the page is released immediately. */
  active: boolean;
  onClose: () => void;
  /** Element that receives focus when the modal closes. Defaults to the element focused before. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Modal essentials: moves focus into the dialog, traps Tab, closes on Escape, makes the app
 * inert, locks page scroll (scrollbar-gutter prevents layout shift) and restores focus.
 */
export function useModalBehavior(
  dialogRef: RefObject<HTMLElement | null>,
  { active, onClose, returnFocusRef }: ModalBehaviorOptions,
): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const returnTarget = returnFocusRef?.current ?? previouslyFocused;
    const appRoot = document.getElementById(APP_ROOT_ID);
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;

    appRoot?.setAttribute('inert', '');
    html.style.overflow = 'hidden';
    dialog.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'Tab') {
        trapFocus(event, dialog);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      appRoot?.removeAttribute('inert');
      html.style.overflow = previousOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [dialogRef, active, onClose, returnFocusRef]);
}
