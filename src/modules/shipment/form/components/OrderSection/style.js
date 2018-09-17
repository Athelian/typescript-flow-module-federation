// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const ItemsSectionWrapperStyle = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  sheight: min-content;
`;

export const ItemGridStyle = css`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const ItemStyle = css`
  display: flex;
  margin: 15px 10px;
`;
