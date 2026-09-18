const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (element) => !element.closest('[inert], [aria-hidden="true"]'),
  );
}

/** Keeps Tab and Shift+Tab cycling inside `container`. */
export function trapFocus(event: KeyboardEvent, container: HTMLElement): void {
  const focusable = getFocusableElements(container);
  const first = focusable[0];
  const last = focusable.at(-1);

  if (!first || !last) {
    event.preventDefault();
    container.focus();
    return;
  }

  const active = document.activeElement;
  const outside = !container.contains(active);

  if (event.shiftKey && (active === first || active === container || outside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
  }
}
