// @flow

import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const TimelineLayoutWrapperStyle = css`
  /* display: grid; */
  /* grid-template-rows: 1fr; */
`;

export const LineOdd = (color: string) => css`
  width: initial;
  margin: 25px 0;
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
    top: calc(50% - 1px);
    bottom: -23px;
    border-right: 2px solid ${colors[color]};
    border-top: 2px solid ${colors[color]};
    -webkit-border-radius: 0 999px 0 0;
    -moz-border-radius: 0 999px 0 0;
    border-radius: 0 999px 0 0;
  }
`;

export const LineEven = (color: string) => css`
  width: initial;
  margin-top: 40px;
  margin-bottom: 25px;
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
    top: -20px;
    bottom: calc(50% - 1px);
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
  top: -17px;
  left: calc(-50% - 20px);
`;

export const TimelineIconDate = css`
  position: absolute;
  top: 25px;
  left: calc(-50%);
`;

export default TimelineLayoutWrapperStyle;
