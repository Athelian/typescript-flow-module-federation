import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const SortWrapperStyle = css`
  flex: 1;

  > div:first-child > div:first-child {
    width: calc(90% - 20px);
  }
`;

export const GroupFilterWrapperStyle = css`
  flex: 3.8;
`;

export const GroupFilterStyle = css`
  float: right;
  width: 26.3%;

  ${layout.HORIZONTAL};
  justify-content: flex-end;

  > div:nth-child(2) {
    width: calc(100% - 30px);
  }
`;

export default null;
