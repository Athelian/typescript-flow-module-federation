// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, transitions } from 'styles/common';

export const PackageItemWrapperStyle: string = css`
  ${presets.BUTTON};
  width: 100%;
  height: 40px;
  &:hover {
    & > span {
      height: 40px;
    }
    & > button {
      opacity: 1;
    }
  }
`;

export const BarStyle = (isActive: boolean): string => css`
  width: 4px;
  ${isActive
    ? `
    background-color: ${colors.TEAL};
    height: 40px;
  `
    : `
    background-color: ${colors.GRAY_VERY_LIGHT};
    height: 0px;
  `};
  ${transitions.EXPAND};
`;

export const DefaultButtonStyle = (isDefault: boolean): string => css`
  ${presets.BUTTON};
  height: 40px;
  width: 40px;
  ${fontSizes.MAIN};
  ${isDefault
    ? `
    color: ${colors.TEAL};
  `
    : `
    color: ${colors.GRAY_SUPER_LIGHT};
    &:hover, :focus {
      color: ${colors.GRAY_VERY_LIGHT};
    }
  `};
`;

export const PackageNameStyle = (hasName: boolean): string => css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${hasName ? colors.BLACK : colors.GRAY_LIGHT};
  width: 156px;
`;

export const DeleteButtonStyle: string = css`
  ${presets.BUTTON};
  height: 40px;
  width: 40px;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  opacity: 0;
  &:hover,
  :focus {
    color: ${colors.RED};
    opacity: 1;
  }
`;
