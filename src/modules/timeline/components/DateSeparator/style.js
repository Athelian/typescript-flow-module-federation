// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const DaySeparatorWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  min-height: 20px;
  padding: 15px 0;
`;

export const SeparatorStyle = css`
  height: 1px;
  width: 100%;
  background-color: ${colors.GRAY_LIGHT};
  flex: 1;
`;

export const DateStyle = css`
  padding: 0 20px;
  ${fontSizes.SMALL};
  letter-spacing: 0.2em;
  color: ${colors.GRAY_DARK};
  user-select: none;
`;
