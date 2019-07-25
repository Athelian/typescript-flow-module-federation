// @flow
import emitter from 'utils/emitter';

export const keyMap = {
  NAVIGATE_RIGHT: ['command+RIGHT', 'ctrl+RIGHT'],
  NAVIGATE_LEFT: ['command+LEFT', 'ctrl+LEFT'],
  NAVIGATE_UP: ['command+up', 'ctrl+up', 'shift+enter'],
  NAVIGATE_DOWN: ['command+down', 'ctrl+down', 'enter'],
  TAB: ['TAB'],
  REVERSE_TAB: ['shift+TAB'],
};

// Id will be have `input-{ROW}-${COLUMN}`
const getCellById = (id: string) => id && id.match(/\d+/g);

export const handlers = {
  TAB: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'TAB');
  },
  REVERSE_TAB: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'REVERSE_TAB');
  },
  NAVIGATE_RIGHT: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'RIGHT');
  },
  NAVIGATE_LEFT: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'LEFT');
  },
  NAVIGATE_UP: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'UP');
  },
  NAVIGATE_DOWN: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    emitter.emit('NAVIGATE', [row, column], 'DOWN');
  },
};
