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
  min-width: 2.5vw;
  max-width: 9vw;
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
