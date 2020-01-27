// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const DeleteButtonStyle = (isHovered: boolean) => css`
  position: absolute;
  bottom: 10px;
  left: 10px;
  ${presets.BUTTON};
  opacity: ${isHovered ? 1 : 0};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
