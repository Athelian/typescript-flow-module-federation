// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, layout } from 'styles/common';

export const CloneDialogWrapperStyle: string = css`
  padding: 20px;
`;

export const DialogMessageStyle: string = css`
  ${fontSizes.LARGE};
  color: ${colors.BLACK};
  font-weight: bold;
  text-align: center;
  margin: 0 0 20px 0;
`;

export const DialogSubMessageStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.GRAY_DARK};
  font-weight: bold;
  text-align: center;
  line-height: 20px;
  margin: 0 0 20px 0;
`;

export const LabelStyle = (color: string): string => css`
  color: ${colors[color]};
`;

export const ButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  padding: 20px 0 0 0;
  justify-content: center;
  grid-gap: 10px;
  border-top: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;
