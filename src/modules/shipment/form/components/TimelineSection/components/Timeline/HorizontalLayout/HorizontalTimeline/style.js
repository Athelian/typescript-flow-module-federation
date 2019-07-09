// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes } from 'styles/common';

export const HorizontalTimelineWrapperStyle: string = css`
  display: flex;
  width: 100%;
  align-items: center;
`;

export const BlankSpaceStyle: string = css`
  flex: 0.5;
`;

export const WarehouseContainerWrapperStyle: string = css`
  position: relative;
`;

export const ContainerIconWrapperStyle: string = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -30px;
  z-index: 1;
`;

export const TooltipTitleStyle: string = css`
  ${fontSizes.MAIN};
  border-bottom: 1px solid ${colors.WHITE};
  padding: 0 0 5px 0;
  margin: 0 0 5px 0;
  letter-spacing: 2px;
`;

export const TooltipWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 70px minmax(50px, 1fr);
`;

export const TooltipLabelStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  text-align: left;
`;
