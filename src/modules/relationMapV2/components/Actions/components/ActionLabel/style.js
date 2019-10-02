// @flow
import { css } from 'react-emotion';
import { fontSizes, transitions, borderRadiuses, colors, presets } from 'styles/common';

export const ActionLabelWrapperStyle = css`
  opacity: 0;
  width: 200px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  ${transitions.EXPAND};
  overflow: hidden;
  pointer-events: none;
`;

export const ActionLabelStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: calc(100% - 50px);
  height: 100%;
  background-color: rgba(85, 85, 85, 0.9);
  color: ${colors.WHITE};
  margin: 0 50px 0 0;
  ${borderRadiuses.BUTTON};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
`;
