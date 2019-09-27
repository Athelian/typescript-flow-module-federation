// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, transitions } from 'styles/common';

export const MiniShipmentTimelineWrapperStyle: string = css`
  display: flex;
  width: 300px;
  align-items: center;
`;

export const TimelinePointWrapperStyle: string = css`
  position: relative;
  &:hover {
    & div {
      opacity: 1;
    }
  }
`;

export const TimelinePointActiveStyle = (isActive: boolean): string => css`
  ${transitions.MAIN};
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 20px;
  height: 3px;
  background-color: ${isActive ? colors.TEAL : 'rgba(255, 255, 255, 0.5)'};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  opacity: ${isActive ? 1 : 0};
`;

export const TimelinePointStyle = (color: string, isActive: boolean): string => css`
  position: relative;
  ${presets.BUTTON};
  color: ${colors[color]};
  border: 2px solid ${colors[color]};
  font-size: 10px;
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  ${isActive
    ? `
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  `
    : `
    &:hover {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  `};
`;

export const TransitPointWrapperStyle: string = css`
  position: relative;
`;

export const TransitHalfWrapperStyle = (side: string, isActive: boolean): string => css`
  position: absolute;
  top: 0;
  ${presets.BUTTON};
  height: 20px;
  width: 10px;
  border-radius: 20px;
  ${side === 'left'
    ? `
    left: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  `
    : `
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  `};
  ${isActive
    ? `
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  `
    : `
    &:hover {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      & div {
        opacity: 1;
      }
    }
  `};
`;

export const TransitPointActiveStyle = (isActive: boolean): string => css`
  ${transitions.MAIN};
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 10px;
  height: 3px;
  background-color: ${isActive ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  opacity: ${isActive ? 1 : 0};
`;

export const TimelineLineStyle = (color: string): string => css`
  height: 2px;
  background-color: ${colors[color]};
  width: 100%;
  flex: 1;
`;

export const TimelineVoyageWrapperStyle: string = css`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

export const TimelineTransportStyle = (color: string): string => css`
  position: absolute;
  top: calc(50% - 10px);
  left: calc(50% - 7px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors[color]};
  font-size: 10px;
  height: 20px;
  width: 14px;
  background-color: ${colors.WHITE};
`;

export const WarehouseContainerWrapperStyle: string = css`
  position: relative;
`;

export const ContainerIconWrapperStyle: string = css`
  position: absolute;
  top: calc(50% - 8px);
  left: -16px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.CIRCLE};
  height: 16px;
  width: 16px;
  color: ${colors.WHITE};
  background-color: ${colors.GRAY_DARK};
  font-size: 8px;
`;

export const TimelineRingWrapperStyle = (percent: number) => css`
  position: absolute;
  width: 20px;
  height: 20px;
  clip: ${percent > 50 ? 'rect(auto, auto, auto, auto)' : `rect(0em, 20px, 20px, 10px)`};
`;

export const TimelineBarStyle = (percent: number) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: 2px solid ${colors.TEAL};
  width: 20px;
  height: 20px;
  clip: rect(0px, 10px, 20px, 0px);
  transform: rotate(${(360 / 100) * percent}deg);
`;

export const TimelineFillStyle = (percent: number) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: 2px solid ${colors.TEAL};
  width: 20px;
  height: 20px;
  clip: rect(0px, 10px, 20px, 0px);
  ${percent > 50 ? 'transform: rotate(180deg)' : ''};
`;
