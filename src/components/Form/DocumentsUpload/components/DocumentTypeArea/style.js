// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets } from 'styles/common';

export const DocumentTypeAreaWrapperStyle: string = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
`;

export const DocumentTypeAreaHeaderStyle: string = css`
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
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
  ${presets.BOX};
  width: 195px;
  height: 100px;
`;
