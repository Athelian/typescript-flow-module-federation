// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  ${fontSizes.SMALL};
  align-items: center;
  width: 105px;
  grid-gap: 5px;
  grid-template-columns: 1fr 1fr 1fr;
`;

export const IconStyle = (color: string): string => css`
  background: ${colors[color]};
  color: #fff;
  display: flex;
  ${layout.CENTER_CENTER};
  width: 20px;
  height: 20px;
`;
