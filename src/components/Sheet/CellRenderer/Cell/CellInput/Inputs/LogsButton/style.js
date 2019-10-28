// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const InputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.MAIN};
  overflow: hidden;
  width: 100%;
  cursor: pointer;
  color: ${colors.GRAY_LIGHT};
`;
