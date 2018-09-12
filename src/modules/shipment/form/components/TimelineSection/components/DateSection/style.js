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
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
`;

export const ApprovedByWrapperStyle = css`
  display: flex;
  flex-direction: column;
`;

export const ApprovedByStyle = css`
  ${fontSizes.SMALL};
  min-height: 10px;
  max-height: 10px;
  line-height: 10px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;
