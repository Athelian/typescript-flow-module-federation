import { css } from 'react-emotion';
import { shadows, fontSizesWithHeights, borderRadiuses, transitions } from 'styles/common';

const widthSize = 150;
const paddingSize = 16;
const distanceSize = 16;

export const TooltipWrapperStyle = css`
  position: relative;
  cursor: help;
`;

export const TooltipBoxStyle = ({ hover, color }) => css`
  ${!hover && `opacity: 0;`};
  position: absolute;
  left: 50%;
  ${transitions.MAIN};

  top: -${distanceSize}px;
  background: ${color};
  width: ${widthSize}px;
  margin-left: -${(widthSize + paddingSize * 2) / 2}px;
  padding: ${paddingSize}px;
  ${borderRadiuses.MAIN};
  color: #fff;
  transform: translateY(-100%);
  ${shadows.TOOLTIP};
  ${fontSizesWithHeights.MEDIUM};
`;

export const TooltipArrowStyle = ({ hover, color }) => css`
  ${!hover && `opacity: 0;`};
  position: absolute;
  left: 50%;
  ${transitions.MAIN};
  z-index: 1;

  top: -${distanceSize}px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid ${color};
  margin-left: -8px;
  padding-bottom: ${distanceSize}px;
`;
