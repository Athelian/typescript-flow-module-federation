// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors } from 'styles/common';

export const QuantitySectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const InitialQuantityStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding: 0 5px;
  ${presets.ELLIPSIS};
  font-weight: bold;
  min-width: 200px;
  text-align: right;
  height: 30px;
  line-height: 30px;
`;

export const AddAdjustmentButtonWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
  width: 410px;
`;

export const CurrentQuantityStyle: string = css`
  ${fontSizes.HUGE};
  color: ${colors.BLACK};
  padding: 0 5px;
  ${presets.ELLIPSIS};
  font-weight: bold;
  min-width: 200px;
  text-align: right;
`;

export const QuantityRevisionItemStyle: string = css`
  position: relative;
`;

export const QuantityRevisionDiffStyle: string = css`
  position: absolute;
  right: -60px;
  top: 0;
`;
