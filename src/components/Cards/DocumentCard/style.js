// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes, transitions } from 'styles/common';

export const DocumentCardWrapperStyle = (cardHeight: string): string => css`
  ${layout.GRID_VERTICAL};
  position: relative;
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: ${cardHeight};
  padding: 5px 0 5px 0;
`;

export const DocumentBottomWrapperStyle = (showMemo: boolean) => css`
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 2;
  background-color: ${colors.WHITE};
  padding: ${showMemo ? '0px 0px 0px 5px;' : '10px'};
`;

export const MemoPanelStyle = (height: string) => css`
  display: flex;
  position: relative;
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  height: ${height};
  width: 100%;
  overflow: hidden;
  ${transitions.EXPAND};
`;

export const CloseButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  z-index: 3;
  background: #fff;
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const DocumentParentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 140px;
  padding: 0 10px;
  align-items: center;
`;

export const DocumentStatusWrapperStyle: string = css`
  height: 65px;
  width: 195px;
  padding: 0 10px;
`;

export const DocumentStatusPlaceholderStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
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
  width: 30px;
  height: 30px;
  line-height: 14px;
  ${fontSizes.MAIN};
  ${downloadDisabled
    ? `
    color: ${colors.GRAY_SUPER_LIGHT};
    cursor: default;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover {
      background-color: ${colors.GRAY_SUPER_LIGHT};
      color: ${colors.TEAL};
    }
    &:focus {
      border-color: ${colors.TEAL};
    }
  `};
`;

export const MemoWrapperStyle = (hasMemo: boolean): string => css`
  ${presets.BUTTON};
  width: 30px;
  height: 30px;
  line-height: 14px;
  ${fontSizes.MAIN};
  color: ${hasMemo ? colors.BLUE : colors.GRAY_LIGHT};
  &:hover {
    ${borderRadiuses.CIRCLE};
    background-color: ${colors.GRAY_SUPER_LIGHT};
    cursor: pointer;
  }
`;
