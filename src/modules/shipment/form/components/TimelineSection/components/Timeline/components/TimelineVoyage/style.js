// @flow
import { css } from 'react-emotion';

export const TimelineVoyageWrapperStyle = (vertical: boolean): string => css`
  display: flex;
  flex-direction: ${vertical ? 'column' : 'row'};
  align-items: center;
  position: relative;
  flex: 2;
`;

export default TimelineVoyageWrapperStyle;
