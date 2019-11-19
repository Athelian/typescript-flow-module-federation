// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const CellDisplayWrapperStyle: string = css`
  ${layout.LAYOUT};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 5px;
`;

export const DisplayContentStyle: string = css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  font-weight: bold;
`;
