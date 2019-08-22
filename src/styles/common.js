export const colors = {
  BLACK: '#555555',

  BLUE: '#0b6ede',
  BLUE_DARK: '#0756af',
  TEAL: '#11d1a6',
  TEAL_HALF: '#b9ece0',
  TEAL_VERY_DARK: '#08a380',
  TEAL_DARK: '#0bbc94',
  TEAL_QUITE_DARK: '#78c5b4',
  TEAL_LIGHT: '#caeee6',
  TEAL_QUITE_LIGHT: '#12B791',

  GRAY: '#bbb',
  GRAY_DARK: '#aaa',
  GRAY_DARK_1: '#555555',
  GRAY_LIGHT: '#ccc',
  GRAY_VERY_LIGHT: '#ddd',
  GRAY_QUITE_LIGHT: '#ddd',
  GRAY_SUPER_LIGHT: '#eeeeee',
  ALMOST_WHITE: '#f3f3f3',
  WHITE: '#ffffff',

  RED: '#ef4848',
  RED_DARK: '#b11717',
  YELLOW: '#ffd400',
  YELLOW_DARK: '#e9c200',
  ORANGE: '#ffa637',
  ORANGE_DARK: '#fc9719',
  PURPLE: '#a34fff',
  PURPLE_DARK: '#802fd9',

  TRANSPARENT: 'rgba(0, 0, 0, 0)',

  PROJECT: '#802FD9',
  MILESTONE: '#C590FF',
  PRODUCT: '#F12C2C',
  PRODUCT_PROVIDER: '#CF0000',
  ORDER: '#ED5724',
  ORDER_DARK: '#B63D1B',
  ORDER_ITEM: '#FBAA1D',
  ORDER_ITEM_DARK: '#C27C16',
  ORDER_ITEM_VERY_DARK: '#EA9500',
  BATCH: '#12B937',
  BATCH_DARK: '#118768',
  SHIPMENT: '#0756AF',
  SHIPMENT_DARK: '#0A437F',
  RELATION_MAP: '#04447E',
  CONTAINER_GROUP: '#2489CD',
  CONTAINER: '#30A8E4',
  CONTAINER_ITEM: '#8BDDFF',
  TASK: '#A34FFF',
  WAREHOUSE: '#9D865A',
  STAFF: '#98A2AC',
  PARTNER: '#474D4D',
  TAG: '#bbbbbb',
  LOGS: '#bbbbbb',
  TARGET: '#555555',
  ENTITY: '#0B6EDE',
  METADATA: '#CCCCCC',
  TEMPLATE: '#CCCCCC',
  EDIT: '#CCCCCC',
  DOCUMENT: '#8FBEB3',
  TABLE: '#5F9286',

  URGENT: '#F12C2C',

  HIGHLIGHT: 'rgba(251,170,29, 0.5)',
  HIGHLIGHT_DARK: '#EF8460',
};

export const gradients = {
  BLUE_TEAL_VERTICAL: `linear-gradient(to bottom, ${colors.BLUE}, ${colors.TEAL})`,
  TEAL_BLUE_VERTICAL: `linear-gradient(to bottom, ${colors.TEAL}, ${colors.BLUE})`,
  BLUE_TEAL_HORIZONTAL: `linear-gradient(to right, ${colors.BLUE}, ${colors.TEAL})`,
  BLUE_TEAL_DIAGONAL: `linear-gradient(to bottom right, ${colors.BLUE}, ${colors.TEAL})`,
  TEAL_HORIZONTAL: `linear-gradient(to right, ${colors.TEAL}, ${colors.TEAL_DARK})`,
  TEAL_DARK_HORIZONTAL: `linear-gradient(to right, ${colors.TEAL_DARK}, ${colors.TEAL_VERY_DARK})`,
};

export const fontSizes = {
  MAIN: 'font-size: 14px',
  HUGE: 'font-size: 20px',
  GIANT: 'font-size: 24px',
  LARGE: 'font-size: 16px',
  SMALL: 'font-size: 12px',
  MEDIUM: 'font-size: 13px',
  LITTLE: 'font-size: 10px',
  TINY: 'font-size: 9px',
};

export const fontSizesWithHeights = {
  MAIN: 'font-size: 14px; min-height: 20px; line-height: 20px',
  HUGE: 'font-size: 20px; min-height: 26px; line-height: 26px',
  GIANT: 'font-size: 24px; min-height: 30px; line-height: 30px',
  LARGE: 'font-size: 16px; min-height: 24px; line-height: 24px',
  SMALL: 'font-size: 12px; min-height: 18px; line-height: 18px',
  MEDIUM: 'font-size: 13px; min-height: 19px; line-height: 19px',
};

export const shadows = {
  WATERFALL: 'box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  DROPDOWN: 'box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2)',
  NAV_BUTTON: 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)',
  TOOLTIP: 'box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2)',
  INPUT: 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)',
  HEADER: 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1)',
  HEADER_REVERSE: 'box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1)',
  HEADER_RIGHT: 'box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1)',
  HEADER_LEFT: 'box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1)',
  FAINT: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)',
};

export const borderRadiuses = {
  MAIN: 'border-radius: 5px',
  MAIN_INSIDE: 'border-radius: 4px',
  CIRCLE: 'border-radius: 50%',
  BUTTON: 'border-radius: 999px',
};

export const transitions = {
  MAIN: 'transition: all 0.1s linear',
  EXPAND: 'transition: all 0.2s ease-out',
};

export const animations = {
  FADE_OUT: `@keyframes topFadeOut {
    0% {
      position: absolute;
      top: -3rem;
      opacity: 0;
    }

    75% {
      position: absolute;
      top: 25%;
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
  animation: topFadeOut 0.5s forwards;
  animation-iteration-count: 1;
  animation-delay: 1s;
  `,
  FADE_IN: `@keyframes  fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
  animation: fadeIn 0.5s forwards;
  animation-iteration-count: 1;
  animation-delay: 1s;
  `,
};

export const scrollbars = {
  MAIN: `
    &::-webkit-scrollbar {
      width: 20px;
      height: 20px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${colors.GRAY_LIGHT};
      border: 7px solid transparent;
      background-clip: content-box;
      &:hover {
        background-color: ${colors.GRAY};
      }
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `,
  SMALL: `
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${colors.GRAY_LIGHT};
      border: 3px solid transparent;
      background-clip: content-box;
      &:hover {
        background-color: ${colors.GRAY};
      }
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `,
  SMALL_WHITE: `
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #fff;
      border: 3px solid transparent;
      background-clip: content-box;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `,
};

export const layout = {};
layout.LAYOUT = 'display: flex;';
layout.HORIZONTAL = `
  ${layout.LAYOUT}
  flex-direction: row;
`;
layout.VERTICAL = `
  ${layout.LAYOUT}
  flex-direction: column;
`;
layout.WRAP = `
  ${layout.LAYOUT}
  flex-wrap: wrap;
`;
layout.CENTER = `
  align-items: center;
`;
layout.JUSTIFIED_CENTER = `
  justify-content: center;
`;
layout.CENTER_CENTER = `
  ${layout.CENTER}
  ${layout.JUSTIFIED_CENTER}
`;
layout.FIT = `
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
layout.GRID_FORM = `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  min-width: min-content;
`;
layout.GRID_VERTICAL = `
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
`;
layout.GRID_HORIZONTAL = `
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
`;

export const presets = {
  BUTTON: `
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    border: 0;
    ${transitions.MAIN};
    &:focus {
      outline: 0;
    }
  `,
  ELLIPSIS: `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  BOX: `
    ${shadows.WATERFALL};
    ${borderRadiuses.MAIN};
    background-color: #fff;
  `,
};
