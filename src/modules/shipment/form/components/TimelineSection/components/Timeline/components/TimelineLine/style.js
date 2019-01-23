// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

type TimelineLine = {
  vertical: boolean,
  color: string,
  size?: number,
};

export const TimelineLineStyle = ({ vertical, color, size }: TimelineLine): string => css`
  position: relative;
  background-color: ${colors[color]};
  flex: ${size || 1};
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
