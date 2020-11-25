// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, layout, fontSizes } from 'styles/common';

export const TagSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const PreviewTagWrapperStyle: string = css`
  padding: 0 5px;
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
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export const EntityIconStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  font-size: 11px;
`;

export const CheckboxWrapperStyle = css`
  ${layout.HORIZONTAL};

  & > span {
    margin-left: 10px;
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
  }

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;
