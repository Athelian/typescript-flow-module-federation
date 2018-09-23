// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const TimelineInfoSectionWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 80px 40px;
  border-bottom: 1px solid ${colors.GRAY_VERY_LIGHT};
  &:last-child {
    border: none;
  }
`;

export const AssignedAndApprovalWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 5px 0 10px 0;
`;

export const AssignmentWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
`;

export const AssignmentStyle: string = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const RemoveAssignmentButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  height: 20px;
  width: 20px;
  background-color: ${colors.WHITE};
  ${shadows.INPUT};
  ${fontSizes.SMALL};
  position: absolute;
  top: -6px;
  right: -6px;
  opacity: 0;
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const AddAssignmentButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  border: 2px dashed ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const ApprovalWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const ApprovedByWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const ApprovedByStyle: string = css`
  ${fontSizes.SMALL};
  min-height: 12px;
  max-height: 12px;
  line-height: 12px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  text-align: right;
`;

export const ApprovedAtStyle: string = css`
  ${fontSizes.MAIN};
  min-height: 18px;
  max-height: 18px;
  line-height: 18px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: right;
`;

export const UnapproveButtonStyle: string = css`
  position: absolute;
  top: 0;
  right: 5px;
  ${presets.BUTTON};
  opacity: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  ${shadows.DROPDOWN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const AddDateButtonWrapperStyle: string = css`
  display: flex;
  width: 410px;
  justify-content: flex-end;
  padding: 0 5px;
`;
