// @flow
import { css } from 'react-emotion';

import { borderRadiuses, colors } from 'styles/common';

export const WrapperStyle: string = css`
  display: flex;
  text-align: center;
  justify-content: space-evenly;
  margin: 10px;
`;

export const IconStyle = (color: string): string => css`
  text-align: center
  color: ${colors[color]};
`;

export const ItemStyle = (color: string): string => css`
  border: 4px solid ${colors[color]};
  width: 90px;
  height: 75px;
  border-radius: 5px;
  padding: 7px;
  cursor: pointer;
  ${borderRadiuses.MAIN};
`;
