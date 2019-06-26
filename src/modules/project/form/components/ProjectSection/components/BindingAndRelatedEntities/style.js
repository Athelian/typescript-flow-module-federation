// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses } from 'styles/common';

export const BindedAndRelatedStyle: string = css`
  display: grid;
  grid-template-columns: 20px 1fr 1fr;
`;

export const IconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  ${fontSizes.SMALL};
`;
