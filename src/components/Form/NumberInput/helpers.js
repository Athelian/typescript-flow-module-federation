// @flow
/**
 *
 * Get current cursor position
 * @param {?HTMLInputElement} element
 * @returns {{ start: number, end: number }}
 */
export function getInputSelection(element: ?HTMLInputElement): { start: number, end: number } {
  let start = 0;
  let end = 0;

  if (
    !!element &&
    typeof element.selectionStart === 'number' &&
    typeof element.selectionEnd === 'number'
  ) {
    start = element.selectionStart;
    end = element.selectionEnd;
  }

  return {
    start,
    end,
  };
}

/**
 *
 * Set cursor on input with position
 * @param {?HTMLInputElement} element
 * @param {number} start
 * @param {number} end
 */
export function setInputSelection(element: ?HTMLInputElement, start: number, end: number) {
  if (element) {
    element.setSelectionRange(start, end);
  }
}
