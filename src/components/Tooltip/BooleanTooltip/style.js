// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const MessageWrapperStyle: string = css`
  display: flex;
  &:first-child {
    margin-bottom: 10px;
  }
`;

export const BooleanWrapperStyle = (on: boolean): string => css`
  color: ${on ? colors.TEAL : colors.GRAY_DARK};
  height: 20px;
  line-height: 20px;
  width: 50px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  letter-spacing: 2px;
`;

export const MessageStyle: string = css`
  text-align: left;
  ${fontSizes.MAIN};
`;
