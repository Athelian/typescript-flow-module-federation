// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const MetadataSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const AddMetadataButtonWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
  width: 410px;
`;
