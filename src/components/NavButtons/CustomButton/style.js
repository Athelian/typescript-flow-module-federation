import { css } from 'react-emotion';
import { presets, shadows, colors, borderRadiuses, fontSizes } from 'styles/common';

export const CustomButtonStyle = color => {
  let mainColor = colors.GRAY_LIGHT;
  let hoverColor = colors.GRAY;
  if (color === 'blue') {
    mainColor = colors.BLUE;
    hoverColor = colors.BLUE_DARK;
  } else if (color === 'teal') {
    mainColor = colors.TEAL;
    hoverColor = colors.TEAL_DARK;
  } else if (color === 'red') {
    mainColor = colors.RED;
    hoverColor = colors.RED_DARK;
  }
  return css`
    ${presets.BUTTON};
    background-color: ${mainColor};
    ${borderRadiuses.BUTTON};
    ${shadows.NAV_BUTTON};
    height: 30px;
    padding: 0 10px;
    font-size: 14px;
    color: #fff;
    border: 2px solid ${colors.TRANSPARENT};
    &:hover {
      background-color: ${hoverColor};
      transform: translateY(-1px);
    }
    &:focus {
      border-color: #fff;
    }
    & > span {
      white-space: nowrap;
      ${fontSizes.SMALL};
      letter-spacing: 2px;
    }
    & > svg {
      margin: 0 0 0 5px;
    }
  `;
};

export const DisabledButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  ${shadows.NAV_BUTTON};
  height: 30px;
  padding: 0 10px;
  font-size: 14px;
  border: 2px solid ${colors.TRANSPARENT};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_DARK};
  cursor: 'default';
  & > span {
    ${fontSizes.SMALL};
    letter-spacing: 2px;
    margin: 0 5px 0 0;
  }
`;
