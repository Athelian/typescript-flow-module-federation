// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const DateDividerWrapperStyle = css`
  position: relative;
  height: 1px;
  width: 100%;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const DateStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 0 20px;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  user-select: none;
  letter-spacing: 2px;
`;
