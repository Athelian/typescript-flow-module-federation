// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const DocumentTypeAreaWrapperStyle: string = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
`;

export const DocumentTypeAreaHeaderStyle: string = css`
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 5px;
`;

export const AddDocumentButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.WHITE};
  background-color: ${colors.TEAL};
  ${borderRadiuses.BUTTON};
  height: 30px;
  padding: 0 10px;
  width: min-content;
  min-width: 75px;
  flex-shrink: 0;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const AddDocumentButtonLabelStyle: string = css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  ${fontSizes.SMALL};
  text-transform: uppercase;
`;

export const AddDocumentButtonIconStyle: string = css`
  margin: 0 0 0 5px;
  ${fontSizes.SMALL};
`;

export const DocumentTypeAreaBodyStyle: string = css`
  padding: 20px 10px 10px 10px;
  display: grid;
  grid-template-columns: repeat(4, 195px);
  grid-auto-rows: min-content;
  grid-column-gap: 20px;
  grid-row-gap: 30px;
`;

export const DummyDocumentCard: string = css`
  width: 195px;
  height: 100px;
`;
