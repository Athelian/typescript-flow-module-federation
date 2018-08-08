export const colors = {
  BLUE: '#0b6ede',
  BLUE_DARK: '#0756af',
  LIGHT_TEAL: 'rgba(13, 218, 172, 0.2)',
  TEAL: '#11d1a6',
  TEAL_DARK: '#0bbc94',
  TEAL_VERY_DARK: '#08a380',
  TEAL_LIGHT: '#caeee6',
  BATCH_GREEN: '#12B937',
  BLACK: '#555',
  GRAY: '#bbb',
  GRAY_DARK: '#aaa',
  GRAY_LIGHT: '#ccc',
  GRAY_VERY_LIGHT: '#ddd',
  GRAY_SUPER_LIGHT: '#eee',
  ALMOST_WHITE: '#f3f3f3',
  RED: '#ef4848',
  RED_DARK: '#b11717',
  YELLOW: '#ffd400',
  YELLOW_DARK: '#e9c200',
  ORANGE: '#ffa637',
  ORANGE_DARK: '#fc9719',
  PURPLE: '#a34fff',
  PURPLE_DARK: '#802fd9',
  TRANSPARENT: 'rgba(0, 0, 0, 0)',
  SHIPMENT_BLUE: '#0861B1',
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
  MEDIUM: 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)',
  NAV_BUTTON: 'box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2)',
  NAV_BUTTON_HOVER: 'box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3)',
  TOOLTIP: 'box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2)',
};

export const borderRadiuses = {
  MAIN: 'border-radius: 5px',
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
      border: 6px solid transparent;
      background-clip: content-box;
      &:hover {
        background-color: ${colors.GRAY};
      }
    }
    &::-webkit-scrollbar-track {
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

export const presets = {
  BUTTON: `
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    border: 0;
    ${transitions.MAIN}
    &:focus {
      outline: 0;
    }
  `,
  DASHED_BUTTON: `
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    ${transitions.MAIN};
    ${borderRadiuses.MAIN};
    color: ${colors.GRAY_LIGHT};
    border: 4px dashed ${colors.GRAY_LIGHT};
    &:hover {
      border-color: ${colors.TEAL};
      color: ${colors.TEAL};
      background-color: rgba(0,0,0,0.05);
    }
    &:focus {
      outline: 0;
      border-color: ${colors.TEAL};
    }
    &:active {
      color: ${colors.TEAL};
      background-color: rgba(0,0,0,0.05);
    }
  `,
  DELETE_BUTTON: `
    ${borderRadiuses.CIRCLE};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    ${transitions.MAIN}
    color: ${colors.GRAY_LIGHT};
    font-size: 24px;
    width: min-content;
    flex-shrink: 0;
    border: 2px solid #fff;
    background-color: #fff;
    ${shadows.NAV_BUTTON};
    &:hover {
      color: ${colors.RED};
      ${shadows.NAV_BUTTON_HOVER};
    }
    &:focus {
      border-color: ${colors.RED};
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
