// @flow
import { css } from 'react-emotion';

export const HoverStyle = (isHover: boolean) =>
  isHover
    ? css`
        cursor: pointer;
        display: flex;
        position: relative;
      `
    : css`
        display: flex;
        position: relative;
      `;

export default HoverStyle;
