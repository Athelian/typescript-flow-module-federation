// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors } from 'styles/common';

export const ItemsSectionWrapperStyle = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
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

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
