// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, presets, shadows, fontSizes } from 'styles/common';

export const DraggedPlaceholderStyle: string = css`
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 55px;
  ${borderRadiuses.MAIN};
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MessageStyle: string = css`
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 3px 5px 5px;
  ${borderRadiuses.MAIN};
  color: ${colors.TEAL};
  ${fontSizes.SMALL};
  text-transform: uppercase;
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  ${shadows.INPUT};
`;
