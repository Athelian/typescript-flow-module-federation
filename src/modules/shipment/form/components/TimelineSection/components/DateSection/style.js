// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const DateSectionWrapperStyle = css`
  display: flex;
  flex-direction: column;
  height: 600px;
  flex-shrink: 0;
  padding: 40px;
`;

export const AssignmentWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
`;

export const AssignmentStyle = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const RemoveAssignmentButtonStyle = css`
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

export const AddAssignmentButtonStyle = css`
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

export const ApprovalWrapperStyle = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
  &:hover {
    & > button {
      opacity: 1;
      left: 5px;
    }
  }
`;

export const ApprovedByWrapperStyle = css`
  display: flex;
  flex-direction: column;
`;

export const ApprovedByStyle = css`
  ${fontSizes.SMALL};
  min-height: 12px;
  max-height: 12px;
  line-height: 12px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ApprovedAtStyle = css`
  ${fontSizes.MAIN};
  min-height: 18px;
  max-height: 18px;
  line-height: 18px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  font-weight: bold;
`;

export const UnapproveButtonStyle = css`
  position: absolute;
  left: -25px;
  top: 0;
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
  focus {
    color: ${colors.RED};
  }
`;
