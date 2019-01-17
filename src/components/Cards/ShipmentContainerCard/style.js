// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, layout, colors, presets, borderRadiuses } from 'styles/common';

export const CardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 354px;
`;

export const ImagePartWrapperStyle: string = css`
  padding: 5px 5px 0 5px;
  background: linear-gradient(to bottom, rgba(11, 110, 222, 0.5), rgba(17, 209, 166, 0.5));
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  height: 80px;
  width: 195px;
`;

export const ImageWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 75px;
  background-color: ${colors.WHITE};
`;

export const ImageStyle: string = css`
  width: 100%;
  height: 75px;
  object-fit: contain;
`;

export const InfoInsideImageWrapperStyle: string = css`
  position: absolute;
  top: 5px;
  left: 5px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 75px;
  width: 185px;
`;

export const NameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.WHITE};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 165px;
`;

export const SerialStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 180px;
`;

export const InfoPartWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  padding: 5px 0;
`;

export const InputStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const LabelInputStyle: string = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const IconInputStyle: string = css`
  display: grid;
  grid-template-columns: 30px 150px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
  grid-gap: 5px;
`;

export const WarehouseIconStyle = (hasWarehouse: boolean): string => css`
  height: 30px;
  width: 30px;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  color: ${colors.WHITE};
  background-color: ${hasWarehouse ? colors.TEAL : colors.GRAY_LIGHT};
`;

export const InputIconStyle: string = css`
  display: grid;
  grid-template-columns: 165px 20px;
  width: 100%;
  padding: 0 5px;
`;

export const ApprovalIconStyle = (approval: boolean): string => css`
  color: ${approval ? colors.BLUE : colors.GRAY_LIGHT};
  &:hover {
    color: ${approval ? colors.BLUE_DARK : colors.GRAY};
  }
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
`;
