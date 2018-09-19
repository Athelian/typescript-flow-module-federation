// @flow
import { css } from 'react-emotion';

import { borderRadiuses, colors } from 'styles/common';

export const LabelStyle = css`
  text-align: center;
  padding-top: 10px;
`;

export const IconStyle = (color: string) => css`
  text-align: center;
  padding-top: 10px;
  color: ${colors[color]};
`;

export const SelectedStyle = (color: string) => css`
  width: 80px;
  height: 80px;
  display: inline-block;
  margin: 10px;
  border: 4px solid ${colors[color]};
  ${borderRadiuses.MAIN};
`;
