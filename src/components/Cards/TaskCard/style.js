// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes, transitions } from 'styles/common';

export const TaskCardWrapperStyle = (hideParentInfo: boolean): string => css`
  position: relative;
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: ${hideParentInfo ? '159px' : '184px'};
  padding: 5px 0 10px 0;
`;

export const TaskInTemplateIconStyle: string = css`
  ${presets.BUTTON};
  position: absolute;
  top: 0;
  right: 20px;
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  background: ${colors.WHITE};
  cursor: pointer;
  z-index: 1;
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 0 5px 0 5px;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 20px;
    width: 10px;
    height: 10px;
    border-radius: 0 5px 0 0;
    box-shadow: 5px 0 0 0 ${colors.WHITE};
    z-index: -1;
  }
`;

export const TaskParentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 140px;
  padding: 0 10px;
  align-items: center;
`;

export const TaskParentIconStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  font-size: 11px;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const TaskNameWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  padding: 0 5px 0 10px;
`;

export const TaskPositionWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  font-weight: bold;
`;

export const DragButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.BLUE};
  }
`;

export const DateInputWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 65px 120px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TaskStatusWrapperStyle: string = css`
  height: 40px;
  width: 195px;
  padding: 0 10px;
`;

export const TaskTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
`;

export const ApprovalWrapperStyle: string = css`
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

export const ApprovalPanelWrapperStyle = (height: string) => css`
  position: relative;
  background-color: ${colors.BLUE};
  ${borderRadiuses.MAIN};
  height: ${height};
  width: 100%;
  overflow: hidden;
  ${transitions.EXPAND};
`;

export const ApprovalInputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  padding: 0 10px;
`;

export const ApprovalButtonStyle = (
  {
    approvedBy,
    rejectedBy,
  }: {
    approvedBy: ?Object,
    rejectedBy: ?Object,
  },
  isExpanded: boolean
) => css`
  position: absolute;
  bottom: 0;
  right: 10px;
  ${presets.BUTTON};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  width: 30px;
  height: 15px;
  border-radius: 30px 30px 0 0;
  flex-shrink: 0;
  ${!isExpanded &&
    !approvedBy &&
    !rejectedBy &&
    `
    background-color: ${colors.GRAY_LIGHT};
    &:hover, :focus {
      background-color: ${colors.GRAY};
    }
  `};
  ${!isExpanded &&
    approvedBy &&
    `
    background-color: ${colors.BLUE};
    &:hover, :focus {
      background-color: ${colors.BLUE_DARK};
    }
  `};
  ${!isExpanded &&
    rejectedBy &&
    `
    background-color: ${colors.RED};
    &:hover, :focus {
      background-color: ${colors.RED_DARK};
    }
  `};
  ${isExpanded &&
    `
    background-color: ${colors.PURPLE};
    &:hover, :focus {
      background-color: ${colors.PURPLE_DARK};
    }
  `};
`;
