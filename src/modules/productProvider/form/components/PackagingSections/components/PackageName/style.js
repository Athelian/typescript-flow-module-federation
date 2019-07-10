// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes } from 'styles/common';

export const PackageItemWrapperStyle = (isHover: boolean, isActive: boolean) => css`
  display: grid;
  grid-template-columns: 40px auto 40px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  ${isActive &&
    `
  background: ${colors.TEAL};
  color: ${colors.WHITE};
  `}
  ${isHover
    ? `
    color: ${colors.WHITE};
    `
    : `
    color: ${colors.GRAY_LIGHT};
    `}
`;

export const PackageNameStyle = css`
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
`;

const currentColor = (isDefault: boolean, isActive: boolean) => {
  if (isDefault) return colors.TEAL;
  if (isActive) return colors.WHITE;
  return colors.ALMOST_WHITE;
};

export const DefaultButtonStyle = (isDefault: boolean, isActive: boolean) => css`
  ${presets.BUTTON};
  color: ${currentColor(isDefault, isActive)};
  &:hover,
  :focus {
    color: ${isActive ? colors.WHITE : colors.TEAL};
  }
`;

export const DeleteButtonStyle = (isHovered: boolean) => css`
  ${presets.BUTTON};
  opacity: ${isHovered ? 1 : 0};
  height: 40px;
  width: 40px;
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export default PackageItemWrapperStyle;
