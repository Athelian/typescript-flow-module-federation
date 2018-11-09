// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const MetadataEditFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL} padding: 50px 0;
`;

export const CustomFieldsSectionWrapperStyle: string = css`
  ${presets.BOX};
  padding: 40px 100px;
  ${layout.GRID_VERTICAL} grid-gap: 20px;
`;
