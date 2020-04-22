// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const CellDisplayWrapperStyle: string = css`
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px;
`;

export const DisplayContentStyle: string = css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  font-weight: bold;
  text-align: left;
`;
