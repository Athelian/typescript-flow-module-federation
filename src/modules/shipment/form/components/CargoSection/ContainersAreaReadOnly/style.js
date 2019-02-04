// @flow
import { css } from 'react-emotion';
import {
  colors,
  shadows,
  borderRadiuses,
  layout,
  presets,
  fontSizes,
  scrollbars,
} from 'styles/common';

export const ContainersWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-columns: 235px;
  grid-template-rows: 50px 1fr 50px;
  ${shadows.HEADER_RIGHT};
  z-index: 2;
`;

export const ContainersNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  position: relative;
`;

export const ContainersBodyWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 65vh;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ContainersHeaderWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const IconStyle: string = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const ContainersGridStyle: string = css`
  ${layout.GRID_VERTICAL};
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  height: 100%;
  padding: 15px 0;
`;

export const SelectBatchesPoolCardWrapperStyle = (isSelected: boolean): string => css`
  position: relative;
  padding: 30px 0 30px 20px;
  ${presets.BUTTON};
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background-color: ${isSelected ? colors.GRAY_LIGHT : colors.GRAY_SUPER_LIGHT};
  text-align: left;
  &:hover {
    background-color: ${isSelected ? colors.GRAY : colors.GRAY_VERY_LIGHT};
    & > div {
      opacity: 1;
    }
  }
`;

export const SelectContainerCardWrapperStyle: string = css`
  position: relative;
  width: 100%;
  padding: 30px 0 30px 20px;
`;

export const SelectContainerCardBackgroundStyle = (isSelected: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  ${presets.BUTTON};
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background-color: ${isSelected ? colors.GRAY_LIGHT : colors.GRAY_SUPER_LIGHT};
  &:hover {
    background-color: ${isSelected ? colors.GRAY : colors.GRAY_VERY_LIGHT};
    & > div {
      opacity: 1;
    }
  }
`;

export const EyeballIconStyle: string = css`
  position: absolute;
  top: 10px;
  left: 5px;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  opacity: 0;
  ${fontSizes.MAIN};
  z-index: 1;
`;

export const ContainersFooterWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_REVERSE};
`;
