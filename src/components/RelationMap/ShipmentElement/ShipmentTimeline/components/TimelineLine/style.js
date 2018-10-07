// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

type TimelineLine = {
  color: string,
};

export const TimelineLineStyle = ({ color }: TimelineLine) => css`
  position: relative;
  flex: 1;
  width: 100%;
  min-width: 35px;
  max-width: 120px;
  height: 20px;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50%);
    border-top: 2px solid ${colors[color]};
  }
`;

export default TimelineLineStyle;
