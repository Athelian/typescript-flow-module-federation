// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const TaskInfoStyle: string = css`
  display: grid;
  grid-template-columns: 20px 1fr 50px;
`;

export const IconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${colors[color]};
  ${fontSizes.SMALL};
`;
