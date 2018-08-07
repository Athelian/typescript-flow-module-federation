// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, shadows, transitions } from 'styles/common';

export const VoyageIconStyle = (color: string, disabled: boolean) => css`
  cursor: ${disabled ? 'default' : 'pointer'};
  color: ${colors[color]};
  ${borderRadiuses.CIRCLE};
  padding: 5px;
  background-color: #fff;
  ${transitions.MAIN};
  ${disabled
    ? ''
    : `&:hover {
    ${shadows.TOOLTIP};
  }`};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  position: absolute;
  right: -15px;
  top: auto;
  bottom: auto;
  z-index: 2;
`;

export default VoyageIconStyle;
