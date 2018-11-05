// @flow
import { css } from 'react-emotion';
import { layout, presets, transitions, colors } from 'styles/common';

export const MetadataFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL} padding: 50px 0;
`;

export const MetadataSectionWrapperStyle: string = css`
  ${presets.BOX} width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL} grid-gap: 20px;
`;

export const MetadataMessageStyle: string = css`
  align-items: center;
  cursor: pointer;
  user-select: none;
  border: 0;
  ${transitions.MAIN};
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
export const MetadataMessageWrapperStyle: string = css`
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
`;
export const MetadataInputStyle: string = css`
  ${layout.VERTICAL};
`;
