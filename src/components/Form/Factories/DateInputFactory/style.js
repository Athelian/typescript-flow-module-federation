// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const DiffDateStyle = (diff: number): string => css`
  color: ${diff > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  width: 25px;
  height: 20px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
`;

export const SyncButtonStyle = css`
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  line-height: 20px;
`;
