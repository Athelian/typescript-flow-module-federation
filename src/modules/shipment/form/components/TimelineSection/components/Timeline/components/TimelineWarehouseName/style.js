// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses } from 'styles/common';

export const TimelineWarehouseNameWrapperStyle = (
  vertical: boolean,
  haveContainer: boolean
): string => css`
  ${vertical
    ? `
    border-radius: 0 999px 999px 0;
    width: 165px;
    height: 30px;
    line-height: 30px;
    transform: translateX(-15px);
  `
    : `
    ${borderRadiuses.BUTTON};
    width: ${haveContainer ? '90px' : '90px'};
    height: 20px;
    line-height: 20px;
  `};
  display: flex;
  justify-content: ${haveContainer ? 'space-between' : 'center'};
  align-items: center;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  z-index: 0;
`;

export const TimelineWarehouseNameStyle = (vertical: boolean): string => css`
  ${vertical
    ? `
    ${fontSizes.MAIN};
    padding: 0 5px 0 20px;
    text-align: left;
  `
    : `
    ${fontSizes.MEDIUM};
    padding: 0 5px;
    text-align: center;
  `};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  font-weight: bold;
`;

export const TimelineWarehouseNameBadgeStyle = (vertical: boolean): string => css`
  ${vertical
    ? `
    min-width: 20px;
    height: 20px;
    ${fontSizes.MEDIUM};
    margin: 0 5px 0 0;
  `
    : `
    min-width: 15px;
    height: 15px;
    ${fontSizes.SMALL};
    margin: 0 2.5px 0 0;
  `};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
`;
