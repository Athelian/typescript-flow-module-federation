// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const DocumentsInputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.MAIN};
  overflow: hidden;
  width: 100%;
  cursor: pointer;
`;

export const DocumentCountWrapperStyle: string = css`
  width: 65px;
  flex-shrink: 0;
`;

export const DocumentIconStyle = (color: string): string => css`
  color: ${colors[color]};
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;
