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
  ${
    isHover
      ? `
    color: ${colors.WHITE};
    `
      : `
    color: ${colors.GRAY_LIGHT};
    `
  }
    ${!isActive &&
      `
      &:hover,
      :focus {
        background: ${colors.GRAY_SUPER_LIGHT};
        cursor: pointer;
      }
    `}
`;

const buttonColor = (isDefault: boolean, isActive: boolean) => {
  if (isActive) return colors.WHITE;
  if (isDefault) return colors.TEAL;
  return colors.ALMOST_WHITE;
};

const textColor = (isActive: boolean, hasName: boolean) => {
  if (isActive) return colors.WHITE;
  if (!hasName) return colors.GRAY_LIGHT;
  return colors.BLACK;
};

export const PackageNameStyle = (isActive: boolean, hasName: boolean) => css`
  ${presets.ELLIPSIS};
  color: ${textColor(isActive, hasName)};
`;

export const DefaultButtonStyle = (isDefault: boolean, isActive: boolean) => css`
  ${presets.BUTTON};
  color: ${buttonColor(isDefault, isActive)};
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
