// @flow

export const keyMap = {
  firstRight: ['command+right', 'ctrl+right'],
  firstLeft: ['command+left', 'ctrl+left'],
  firstTop: ['command+up', 'ctrl+up', 'shift+enter'],
  firstBottom: ['command+down', 'ctrl+down', 'enter'],
  tab: ['tab'],
  reverseTab: ['shift+tab'],
};

const calculatePosition = (position: [string | number, string | number], type: string) => {
  const [row, column] = position;
  switch (type) {
    default:
      return position;
    case 'tab':
    case 'right':
      return [Number(row), Number(column) + 1];
    case 'reverseTab':
    case 'left':
      return [Number(row), Number(column) - 1];
    case 'top':
      return [Number(row) - 1, column];
    case 'bottom':
      return [Number(row) + 1, column];
    case 'newLine':
      return [Number(row) + 1, 1];
    case 'previousLine':
      return [Number(row) - 1, 1];
  }
};

const focusCell = (position: [string | number, string | number], type: string) => {
  const [row, column] = calculatePosition(position, type);
  const cell = document.getElementById(`input-${row}-${column}`);
  if (cell && cell.hasAttribute('disabled')) {
    focusCell([row, column], type);
  } else if (cell && !cell.hasAttribute('disabled')) {
    cell.focus();
  } else if (!cell && type === 'tab') {
    focusCell([row, column], 'newLine');
  } else if (!cell && type === 'reverseTab') {
    focusCell([row, column], 'previousLine');
  }
};

// Id will be have `input-{ROW}-${COLUMN}`
const getCellById = (id: string) => id && id.match(/\d+/g);

export const handlers = {
  tab: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'tab');
  },
  reverseTab: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'reverseTab');
  },
  firstRight: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'right');
  },
  firstLeft: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'left');
  },
  firstTop: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'top');
  },
  firstBottom: (e: SyntheticInputEvent<EventTarget>) => {
    e.preventDefault();
    const [row, column] = getCellById(e.target.id) || [];
    focusCell([row, column], 'bottom');
  },
};
