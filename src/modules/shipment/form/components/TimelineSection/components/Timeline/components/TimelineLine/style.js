// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

type TimelineLine = {
  vertical: boolean,
  color: string,
};

export const TimelineLineStyle = ({ vertical, color }: TimelineLine): string => css`
  position: relative;
  background-color: ${colors[color]};
  flex: 1;
  ${vertical
    ? `
    width: 2px;
    height: 100%;
  `
    : `
    height: 2px;
    width: 100%;
  `};
`;

export default TimelineLineStyle;
