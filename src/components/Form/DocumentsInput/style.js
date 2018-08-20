// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const DocumentListStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 140px);
  grid-auto-rows: min-content;
  grid-gap: 20px;
`;

export const AddDocumentStyle = css`
  ${presets.BUTTON};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  ${borderRadiuses.MAIN};
  width: 140px;
  height: 160px;
  border: 5px dashed ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_LIGHT}
  font-size: 40px;
  &:hover {
    color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.05);
    border-color: ${colors.GRAY};
  }
  &:focus {
    border-color: ${colors.TEAL};
  }
`;

export const ProgressStyle = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 140px;
  height: 160px;
  color: ${colors.TEAL};
  font-size: 24px;
`;

export const NoDocumentsStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.GRAY_DARK};
  text-align: center;
`;
