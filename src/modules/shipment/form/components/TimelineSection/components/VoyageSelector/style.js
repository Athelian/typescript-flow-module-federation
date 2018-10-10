// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes, shadows } from 'styles/common';

export const VoyageSelectorWrapperStyle: string = css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  ${shadows.FAINT};
  padding: 0 0 0 10px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const VoyageOptionsWrapperStyle: string = css`
  display: flex;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  ${shadows.FAINT};
`;

export const VoyageIconWrapperStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  width: 70px;
  height: 50px;
  flex-shrink: 0;
  ${isActive
    ? `
    color: ${colors.TEAL};
  `
    : `
    color: ${colors.GRAY_DARK};
    &:hover, :focus {
      color: ${colors.WHITE};
      background-color: ${colors.TEAL};
    }
  `};
  &:first-child {
    ${borderRadiuses.MAIN};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

export const VoyageIconStyle = (position: 'middle' | 'top' | 'bottom'): string => css`
  ${fontSizes.MAIN};
  ${position === 'top' && 'padding: 0 0 10px 0'};
  ${position === 'bottom' && 'padding: 10px 0 0 0'};
`;
