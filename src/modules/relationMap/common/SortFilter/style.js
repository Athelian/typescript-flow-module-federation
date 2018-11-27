import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const SortWrapperStyle = css`
  flex: 0.96;

  > div:first-child > div:first-child {
    width: calc(100% - 20px);
  }
`;

export const GroupFilterWrapperStyle = css`
  flex: 3.8;
`;

export const GroupFilterStyle = css`
  float: left;
  ${layout.HORIZONTAL};
  justify-content: flex-end;
  align-items: center;
  > div:nth-child(2) {
    width: calc(100% - 30px);
  }
`;

export default null;
