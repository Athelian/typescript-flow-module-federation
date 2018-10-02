// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const TagSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const DescriptionLabelWrapperStyle: string = css`
  height: 90px;
`;

export const ColorInputWrapperStyle: string = css`
  position: relative;
`;

export const ColorInputButtonStyle: string = css`
  position: absolute;
  top: 0;
  right: -35px;
`;

export const EntityTypesWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-auto-rows: min-content;
  grid-row-gap: 10px;
  min-width: 400px;
  padding: 5px;
`;

export const EntityTypeStyle: string = css`
  display: flex;
  align-items: center;
`;

export const EntityIconStyle = (color: string) => css`
  color: ${colors[color]};
  ${fontSizes.MAIN};
`;
