// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const HoverStyle = (isHover: boolean) =>
  isHover
    ? css`
        border-radius: 2px;
        border: 2px solid ${colors.GRAY_LIGHT};
        cursor: pointer;
        width: 100%;
        display: flex;
        position: relative;
      `
    : css`
        display: flex;
        position: relative;
      `;

export default HoverStyle;
