// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, transitions, shadows } from 'styles/common';

export const TimelineIconStyle = (color: string, ring: boolean, disabled: boolean) => css`
  cursor: ${disabled ? 'default' : 'pointer'};
  color: ${colors[color]};
  border: ${ring ? '2px' : '0'} solid ${colors[color]};
  background-color: #fff;
  ${borderRadiuses.CIRCLE};
  padding: 5px;
  ${transitions.MAIN};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${disabled
    ? ''
    : `&:hover {
    ${shadows.TOOLTIP};
  }`};
`;

export default TimelineIconStyle;
