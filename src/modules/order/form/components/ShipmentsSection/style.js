// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors } from 'styles/common';

export const ItemsSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const ItemGridStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const ItemStyle: string = css`
  display: flex;
  margin: 15px 10px;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
