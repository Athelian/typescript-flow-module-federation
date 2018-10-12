// @flow

import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses } from 'styles/common';

export const TagsWrapperStyle = css`
  position: absolute;
  bottom: -30px;
  height: initial;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const TagLabelStyle = (color: string) => css`
  background-color: ${color};
  color: white;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  ${fontSizes.SMALL};
  font-weight: lighter;
  padding: 2px 3px;
  margin: 2px;
`;

export const MoreTags: string = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  margin: 4px;
  ${borderRadiuses.BUTTON};
`;
