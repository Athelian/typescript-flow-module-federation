// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors, layout, borderRadiuses, scrollbars } from 'styles/common';

export const OrderSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const OrderSectionBodyStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 30px;
  padding: 30px 10px;
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 80vh;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
