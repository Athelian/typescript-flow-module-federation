// @flow

import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const TimelineLayoutWrapperStyle = css`
  display: grid;
  grid-template-rows: 1fr;
`;

export const LineOdd = (color: string) => css`
  width: initial;
  height: 80px;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
  position: relative;

  :after {
    content: '';
    position: absolute;
    right: -5px;
    width: 5px;
    top: calc(50%);
    bottom: 0;
    border-right: 2px solid ${colors[color]};
    border-top: 2px solid ${colors[color]};
    -webkit-border-radius: 0 999px 0 0;
    -moz-border-radius: 0 999px 0 0;
    border-radius: 0 999px 0 0;
  }
`;

export const LineEven = (color: string) => css`
  width: initial;
  height: 80px;
  display: flex;
  flex-direction: row;
  flex-flow: row-reverse wrap;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
  position: relative;

  :after {
    content: '';
    position: absolute;
    right: -5px;
    width: 5px;
    top: 0;
    bottom: calc(50% - 2px);
    border-right: 2px solid ${colors[color]};
    border-bottom: 2px solid ${colors[color]};
    -webkit-border-radius: 0 0 999px 0;
    -moz-border-radius: 0 0 999px 0;
    border-radius: 0 0 999px 0;
  }
`;

export const TimelineIconWrapperStyle = css`
  position: relative;
`;

export const TimelineIconName = css`
  position: absolute;
  top: -20px;
  left: calc(-50% - 20px);
`;

export const TimelineIconDate = css`
  position: absolute;
  top: 25px;
  left: calc(-50%);
`;

export default TimelineLayoutWrapperStyle;
