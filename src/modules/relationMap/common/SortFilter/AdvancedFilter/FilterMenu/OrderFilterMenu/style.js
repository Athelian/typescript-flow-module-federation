// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const OrderFilterMenuWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const OrderFiltersBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${colors.GRAY_VERY_LIGHT};
  flex-shrink: 0;
`;

export const OrderTogglesBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
`;
