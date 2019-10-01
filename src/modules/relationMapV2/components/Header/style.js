// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, borderRadiuses, presets, shadows } from 'styles/common';

export const EntitiesNavbarWrapperStyle: string = css`
  display: flex;
  width: min-content;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 2;
  ${shadows.HEADER};
`;

export const EntityNavbarWrapperStyle = (color: string, width: number): string => css`
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  background-color: ${colors[color]};
  width: ${width + 20}px;
  padding: 0 0 0 15px;
  overflow: hidden;
`;

export const EntityIconStyle: string = css`
  position: absolute;
  width: 50px;
  left: -25px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
`;

export const TitleWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 125px;
`;

export const OrderTitleWrapperStyle = (canAdd: boolean) => css`
  position: relative;
  height: 20px;
  ${canAdd &&
    `
    &:hover {
      & > button {
        opacity: 1;
      }
      & > div {
        opacity: 0;
      }
    }
  `}
`;

export const AddOrderButtonCollapsedStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  color: ${colors.WHITE};
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 5px;
  height: 20px;
`;

export const AddOrderButtonStyle: string = css`
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN};
  height: 20px;
  line-height: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background-color: rgba(255, 255, 255, 0.3);
  justify-content: space-between;
  padding: 0 5px;
`;

export const SelectAllButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN};
  height: 20px;
  line-height: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: space-between;
  padding: 0 5px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const SortInputWrapperStyle: string = css`
  margin-left: auto;
  padding: 0 10px 0 0;
`;

export const ShipmentTimelineWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  color: ${colors.BLACK};
  padding: 0 5px;
  height: 40px;
  margin: 0 5px 0 auto;
`;
