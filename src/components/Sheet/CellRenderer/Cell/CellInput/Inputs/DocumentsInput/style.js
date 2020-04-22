// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses } from 'styles/common';

export const DocumentsInputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.MAIN};
  overflow: hidden;
  width: 100%;
  height: 30px;
  cursor: pointer;
`;

export const DocumentIconStyle = (color: string): string => css`
  color: ${colors[color]};
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

export const DocumentsDialogWrapperStyle: string = css`
  background-color: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.MAIN};
`;
