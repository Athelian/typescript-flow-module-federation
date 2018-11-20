// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const DateInputWrapperStyle = css`
  &::-webkit-clear-button {
    display: none;
  }
`;

export const ApprovalWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;
