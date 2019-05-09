// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const ContainerWarehouseArrivalSectionWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 80px 40px;
  border-bottom: 1px solid ${colors.GRAY_VERY_LIGHT};
  width: 490px;
`;

export const WarehouseArrivalInfoIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -40px;
  top: -80px;
  color: ${colors.GRAY_LIGHT};
  width: 40px;
  height: 40px;
`;
