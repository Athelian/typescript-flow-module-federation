// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors } from 'styles/common';

export const LogsButtonStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  width: 100%;
  height: 30px;
  padding: 0 5px;
  cursor: pointer;
  user-select: none;
  border: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  overflow: hidden;
  &:focus {
    outline: 0;
  }

  & > span {
    margin-left: 5px;
  }
`;
