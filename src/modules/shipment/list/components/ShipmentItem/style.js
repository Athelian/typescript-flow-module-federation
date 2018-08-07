// @flow
import { css } from 'react-emotion';
import {
  layout,
  fontSizes,
  presets,
  colors,
  borderRadiuses,
  fontSizesWithHeights,
  transitions,
} from 'styles/common';

export const WrapperStyle = css`
  position: relative;
  ${presets.BUTTON};
  ${presets.BOX};
  min-height: min-content;
  display: flex;
  flex-direction: column;
  padding: 5px 10px 10px 10px;
  overflow: hidden;
  align-items: flex-start;
  &:focus {
    outline: none;
    background-color: ${colors.ALMOST_WHITE};
  }
  &:hover {
    background-color: ${colors.ALMOST_WHITE};
  }
`;

export const ShipmentInfoWrapperStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding: 0 0 5px 0;
  align-items: center;
  width: 100%;
`;

export const InfoWrapperStyle = css`
  ${layout.VERTICAL};
`;

export const ShipmentIDStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
`;

export const BLNoStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY};
`;

export const TagsWrapperStyle = css`
  ${borderRadiuses.MAIN};
  display: flex;
  justify-content: flex-end;
  width: 100%;
  overflow: hidden;
  height: 18px;
`;

export const TagStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.SMALL};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color};
  padding: 0 4px;
  font-weight: bold;
  margin: 0 0 0 5px;
  color: ${color};
  height: min-content;
  width: min-content;
  user-select: none;
  flex-shrink: 0;
`;

export const BadgeButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  background-color: rgba(0, 0, 0, 0.05);
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  padding: 3px 10px;
  user-select: none;
  border: 2px solid transparent;
  justify-content: flex-start;
  height: min-content;
  width: 80px;
  margin-left: auto;
  margin-top: 5px;
  & > svg {
    margin: 0 2px 0 0;
  }
  &:focus {
    border-color: ${colors.TEAL};
  }
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.TEAL};
  }
`;

export const TimelineWrapperStyle = css`
  ${borderRadiuses.MAIN};
  ${presets.BUTTON};
  position: relative;
  justify-content: flex-start;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  &:hover {
    & > svg {
      opacity: 1;
    }
    background: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const EyeIconStyle = css`
  ${fontSizes.MAIN};
  ${transitions.MAIN};
  position: absolute;
  top: 2px;
  right: 5px;
  color: ${colors.GRAY_DARK};
  opacity: 0;
`;
