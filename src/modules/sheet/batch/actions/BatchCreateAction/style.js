// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const DialogWrapperStyle: string = css`
  ${layout.VERTICAL};
  padding: 0 30px 20px 30px;
  min-width: 400px;
`;

export const DialogMessageStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  border-top: 1px solid ${colors.GRAY_SUPER_LIGHT};
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
`;
