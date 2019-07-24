// @flow
import { css } from 'react-emotion';
import {
  fontSizesWithHeights,
  layout,
  colors,
  presets,
  borderRadiuses,
  fontSizes,
} from 'styles/common';

export const CardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 394px;
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

export const ContainerTypeWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 100px 80px;
  grid-gap: 5px;
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
  grid-template-columns: 20px 155px;
  grid-gap: 5px;
  width: 100%;
  padding: 0 0 0 10px;
  align-items: center;
`;

export const WarehouseIconStyle = (hasWarehouse: boolean): string => css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${hasWarehouse ? colors.WAREHOUSE : colors.GRAY_VERY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  ${layout.CENTER_CENTER};
`;

export const LabelStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const InputIconStyle: string = css`
  display: grid;
  align-items: center;
  grid-template-columns: 165px 20px;
  // grid-gap: 5px;
  width: 100%;
  padding: 0 5px;
`;

export const ApprovalIconStyle = (approval: boolean, editable: boolean): string => css`
  ${fontSizes.MAIN};
  ${presets.BUTTON};
  color: ${approval ? colors.BLUE : colors.GRAY_LIGHT};
  ${editable &&
    `
    &:hover,
    :focus {
      color: ${approval ? colors.BLUE_DARK : colors.GRAY};
    }
  `}
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
`;
