// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const TimelineWrapperStyle = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  flex-direction: row;
`;

export default TimelineWrapperStyle;
