// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const WrapperStyle = css`
  flex: 1;
  padding: 0 5px;
  z-index: 2;

  & > input {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    line-height: 18px;
    font-weight: 600;
  }
`;
