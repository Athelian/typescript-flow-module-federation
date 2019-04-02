// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const DocumentListStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 140px);
  grid-auto-rows: min-content;
  grid-gap: 20px;
`;

export const AddDocumentStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  font-size: 30px;
  color: rgba(0, 0, 0, 0.2);
  border: 5px dashed rgba(0, 0, 0, 0.2);
  background: none;
  width: 140px;
  height: 165px;
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const NoDocumentsStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.GRAY_DARK};
  text-align: center;
`;
