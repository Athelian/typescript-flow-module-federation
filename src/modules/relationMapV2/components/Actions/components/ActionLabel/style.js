// @flow
import { css } from 'react-emotion';
import { fontSizes, transitions, borderRadiuses, colors, presets } from 'styles/common';

export const ActionLabelWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  width: 0px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 50px;
  ${borderRadiuses.BUTTON};
  ${fontSizes.SMALL};
  ${transitions.EXPAND};
  background-color: rgba(85, 85, 85, 0.9);
  color: ${colors.WHITE};
  overflow: hidden;
  ${presets.ELLIPSIS};
`;

export default ActionLabelWrapperStyle;
