// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  shadows,
  colors,
  borderRadiuses,
  fontSizesWithHeights,
  fontSizes,
} from 'styles/common';

export const OrderItemStyle = css`
  ${layout.VERTICAL};
  width: 100%;
  padding: 10px;
`;

export const POStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.LARGE};
  color: ${colors.BLACK};
  font-weight: bold;
`;

export const PODateStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MEDIUM};
  height: 15px;
  color: ${colors.BLACK};
  text-align: center;
  font-weight: bold;
`;

export const ExporterStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  font-weight: bold;
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const IconStyle = css`
  color: ${colors.GRAY_DARK};
`;

export const QuantitiesWrapper = css`
  display: flex;
  flex-direction: column;
  width: 90px;
  height: 80px;
  justify-content: center;
`;

export const QuantityStyle = (color: string) => css`
  color: ${colors[color]};
  ${fontSizes.LARGE};
  ${presets.ELLIPSIS};
  font-weight: bold;
  & > svg {
    color: ${colors.GRAY};
    ${fontSizes.SMALL};
    margin: 0 5px 0 0;
  }
`;

export const UnshippedQuantityStyle = css`
  position: relative;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MEDIUM};
  ${presets.ELLIPSIS};
  font-weight: bold;
  & > svg {
    color: ${colors.GRAY_LIGHT};
    ${fontSizes.SMALL};
    margin: 0 5px 0 0;
  }
`;

export const SlashStyle = css`
  width: 2px;
  height: 16px;
  background-color: #fff;
  position: absolute;
  left: 6px;
  top: 1px;
  transform: rotate(-45deg);
`;

export const ChartButtonStyle = css`
  width: 70px;
  height: 70px;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  border: 2px solid transparent;
  &:focus {
    border-color: ${colors.TEAL};
    background-color: #fff;
    ${shadows.NAV_BUTTON_HOVER};
  }
  &:hover {
    background-color: #fff;
    ${shadows.NAV_BUTTON_HOVER};
  }
`;

export const FooterStyle = css`
  ${layout.HORIZONTAL};
`;
