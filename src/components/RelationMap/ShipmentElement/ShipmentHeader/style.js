// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ShipmentActionsWrapperStyle = (archived: boolean) => css`
  min-width: 190px;
  width: 100%;
  display: grid;
  grid-template-columns: min-content auto auto min-content min-content;
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};

  height: 22px;
  line-height: 22px;
  letter-spacing: 2px;
  > * {
    height: 22px;
  }
`;

export const ShipmentActionCheckStyle = (archived: boolean) => css`
  cursor: pointer;
  user-select: none;
  border: 3px solid ${archived ? colors.TEAL : 'transparent'};
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
  transition: all 0.1s linear;
  &:focus {
    outline: 0;
  }
  font-size: 10px;
  line-height: 10px;
  width: min-content;
  padding: 2px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  background-color: transparent;
  &:hover,
  :focus {
    color: ${archived ? colors.GRAY_DARK : colors.TEAL_DARK};
  }
`;

export const ShipmentActionLabelStyle = css``;
export const ShipmentActionToggleButtonStyle = css`
  ${presets.BUTTON};
  background-color: transparent;
  color: ${colors.GRAY};
`;
export const ShipmentActionSummaryStyle = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 8px;
  align-items: center;
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
  background-color: #eeeeee;
  padding: 0 10px;
`;
