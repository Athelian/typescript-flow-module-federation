// @flow
import { css } from 'react-emotion';

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
