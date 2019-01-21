import { css } from 'react-emotion';
import { borderRadiuses, layout, colors, fontSizes, shadows, presets } from 'styles/common';

const BaseRow = css`
  padding: 0 10px 5px 10px;
`;

export const BaseText = css`
  ${presets.ELLIPSIS};
`;

export const CardWrapper = css`
  ${borderRadiuses.MAIN};
  color: ${colors.GRAY_DARK_1};
  ${fontSizes.SMALL};
  width: 195px;
  height: 163px;
  padding-top: 5px;
`;

export const BatchRow = css`
  ${BaseRow};
  ${BaseText};
`;

export const QuantityRow = css`
  ${BaseRow};
  padding-right: 5px;
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const OrderRow = css`
  ${BaseRow};
  ${layout.HORIZONTAL};
`;

export const TagWrapper = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
  ${BaseRow};
`;

export const DetailWrapper = css`
  ${layout.HORIZONTAL};
  ${BaseRow};
`;

const IconWrapper = css`
  ${borderRadiuses.CIRCLE};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 2px;
  margin-right: 5px;
`;

export const LightIconWrapper = css`
  ${IconWrapper};
  background-color: ${colors.TEAL};
`;

export const GrayIconWrapper = css`
  ${IconWrapper};
  background-color: ${colors.GRAY_LIGHT};
`;

export const GrayCircleIconWrapper = css`
  ${IconWrapper};
  border: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_VERY_LIGHT};
`;

export const GrayLabel = css`
  font-style: normal;
  letter-spacing: 2px;
  color: ${colors.GRAY_DARK};
`;

export const QuantityWrapper = css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const QuantityInput = css`
  ${shadows.INPUT};
  width: 90px;
  padding: 0 5px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  text-align: right;
`;

export const Divider = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 1px 10px 5px 10px;
`;
