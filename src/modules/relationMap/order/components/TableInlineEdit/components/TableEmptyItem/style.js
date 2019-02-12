// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const WrapperStyle: string = css`
  display: flex;
  width: 100%;
`;

export const EmptyItemStyle: string = css`
  width: 200px;
  height: 30px;
  ${borderRadiuses.MAIN};
  background-color: rgba(0, 0, 0, 0.05);
  margin: 5px;
`;
