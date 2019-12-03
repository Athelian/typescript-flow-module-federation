// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, shadows } from 'styles/common';

export const ValidationCardOverlayWrapperStyle = css`
  position: relative;
`;

export const ValidationCardOverlayStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  ${borderRadiuses.MAIN};
  background-color: rgba(239, 72, 72, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MessageStyle: string = css`
  background-color: rgba(239, 72, 72, 0.7);
  padding: 5px 3px 5px 5px;
  ${borderRadiuses.MAIN};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  text-transform: uppercase;
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  ${shadows.INPUT};
  text-align: center;
  user-select: none;
`;
