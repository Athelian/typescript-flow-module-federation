// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses } from 'styles/common';

export const TimelineWarehouseNameStyle = css`
  ${presets.ELLIPSIS};
`;

export const TimelineWarehouseNameWrapperStyle = (vertical: boolean): string => css`
  ${vertical
    ? `
    text-align: left;
    border-radius: 0 999px 999px 0;
    width: 165px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px 0 20px;
    
    ${fontSizes.MAIN};
  `
    : `
    text-align: center;
    ${borderRadiuses.BUTTON};
    width: 100px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    ${fontSizes.MEDIUM};
  `};

  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  font-weight: bold;
  user-select: none;
  z-index: 0;
`;

export const TimelineRemainContainerWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 15px;
  width: 15px;
  height: 15px;
  ${borderRadiuses.CIRCLE};
  ${fontSizes.LITTLE};
  background-color: ${colors.GRAY_DARK};
  color: ${colors.WHITE};
`;
export default TimelineWarehouseNameWrapperStyle;
