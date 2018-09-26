// @flow

import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const TagsWrapperStyle = css`
  position: absolute;
  bottom: -35px;
  height: initial;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const TagLabelStyle = (color: string) => css`
  background-color: ${colors[color]};
  color: white;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  ${fontSizes.SMALL};
  font-weight: lighter;
  padding: 2px 3px;
  margin: 2px;
`;
