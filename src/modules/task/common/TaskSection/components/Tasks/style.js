// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ItemStyle: string = css`
  display: flex;
  margin: 15px 7.5px;
`;

export const TitleWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
