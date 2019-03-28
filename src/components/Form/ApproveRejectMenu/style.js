// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const ApproveRejectMenuWrapperStyle = (width: string): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.WHITE};
  height: 40px;
  width: ${width};
`;

const ButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  height: 100%;
  ${borderRadiuses.BUTTON};
  overflow: hidden;
  ${shadows.FAINT};
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const ApproveButtonWrapperStyle = (approveIsExpanded: boolean): string => css`
  ${ButtonWrapperStyle};
  ${approveIsExpanded
    ? `
    flex: 1
  `
    : `
    width: 40px;
    & > :last-child {
      visibility: hidden;
    }
  `};
  color: ${colors.BLUE};
`;

export const RejectButtonWrapperStyle = (approveIsExpanded: boolean): string => css`
  ${ButtonWrapperStyle};
  ${!approveIsExpanded
    ? `
    flex: 1
  `
    : `
    width: 40px;
    & > :first-child {
      visibility: hidden;
    }
  `};
  color: ${colors.RED};
  justify-content: flex-end;
`;

export const ButtonIconStyle: string = css`
  ${presets.BUTTON};
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const ButtonLabelStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  user-select: none;
  text-transform: uppercase;
  text-align: center;
  width: calc(100% - 40px);
`;
