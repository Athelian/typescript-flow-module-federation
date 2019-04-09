// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  colors,
  shadows,
  borderRadiuses,
  fontSizes,
  transitions,
} from 'styles/common';

export const DocumentWrapperStyle = (isExpanded: boolean): string => css`
  position: relative;
  display: flex;
  ${isExpanded && 'grid-column: 1 / -1'};
  ${borderRadiuses.MAIN};
`;

export const DocumentCardStyle: string = css`
  ${presets.BOX};
  ${layout.GRID_VERTICAL};
  width: 140px;
  height: 165px;
  grid-gap: 5px;
  padding: 5px;
`;

export const FileExtensionIconStyle = (color: string): string => css`
  font-size: 40px;
  text-align: center;
  color: ${colors[color]};
`;

export const BottomWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
  width: 130px;
`;

export const FileNameWrapperStyle: string = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 0 0 0 5px;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;

const getFileStatusColor = (status: string): { textColor: string, backgroundColor: string } => {
  switch (status) {
    case 'Draft':
      return { textColor: 'BLACK', backgroundColor: 'GRAY_SUPER_LIGHT' };
    case 'Submitted':
      return { textColor: 'WHITE', backgroundColor: 'BLUE' };
    case 'Revise':
      return { textColor: 'WHITE', backgroundColor: 'RED' };
    case 'Approved':
      return { textColor: 'WHITE', backgroundColor: 'TEAL' };
    default:
      return { textColor: 'BLACK', backgroundColor: 'WHITE' };
  }
};

export const FileStatusColoringWrapper = (status: string, editable: boolean) => {
  const coloring = getFileStatusColor(status);

  if (editable) {
    return css`
      & > div {
        & > div {
          & > div {
            background-color: ${colors[coloring.backgroundColor]};
            & > input {
              color: ${colors[coloring.textColor]};
            }
          }
        }
      }
    `;
  }
  return css`
    background-color: ${colors[coloring.backgroundColor]};
    ${borderRadiuses.MAIN};
    & > div {
      & > div {
        color: ${colors[coloring.textColor]};
      }
    }
  `;
};

export const DownloadButtonStyle = (downloadDisabled: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  border: 2px solid transparent;
  height: 30px;
  width: 30px;
  ${fontSizes.MEDIUM};
  flex-shrink: 0;
  margin: 0 0 0 5px;
  ${downloadDisabled
    ? `
    color: ${colors.GRAY_SUPER_LIGHT};
    cursor: default;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover {
      background-color: ${colors.GRAY_VERY_LIGHT};
      color: ${colors.TEAL};
    }
    &:focus {
      border-color: ${colors.TEAL};
    }
  `};
`;

export const MemoWrapperStyle = (isExpanded: boolean): string => css`
  position: relative;
  ${presets.BOX};
  width: ${isExpanded ? '100%' : '0px'};
  ${transitions.EXPAND};
  overflow: hidden;
  margin: 0 0 0 10px;
  & > div {
    margin: 20px;
  }
`;

export const OpenMemoButtonStyle = (isExpanded: boolean, hasMemo: boolean): string => css`
  position: absolute;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  right: -15px;
  top: 65px;
  ${shadows.NAV_BUTTON};
  background-color: ${hasMemo && !isExpanded ? colors.TEAL : colors.WHITE};
  color: ${hasMemo && !isExpanded ? colors.WHITE : colors.GRAY_LIGHT};
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const ProgressStyle: string = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 140px;
  height: 165px;
  color: ${colors.TEAL};
  font-size: 24px;
`;
