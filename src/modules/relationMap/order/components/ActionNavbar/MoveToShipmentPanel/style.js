// @flow
import styled, { css } from 'react-emotion';
import { presets, layout, colors, shadows, fontSizes } from 'styles/common';

export const MoveToShipmentPanelWrapperStyle: string = css`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 0;
  background-color: ${colors.TEAL_LIGHT};
  ${shadows.HEADER};
  z-index: 1;
`;

export const MoveToShipmentLabelAndMessageWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${shadows.HEADER_RIGHT};
  height: 100%;
  flex: 1;
`;

export const MoveToShipmentLabelWrapperStyle: string = css`
  display: flex;
  align-items: center;
  color: ${colors.TEAL_DARK};
  ${fontSizes.SMALL};
  padding: 0 0 0 20px;
`;

export const MoveToShipmentMessageWrapperStyle: string = css`
  display: flex;
  align-items: center;
  color: ${colors.TEAL_DARK};
  ${fontSizes.SMALL};
  flex: 1;
`;

export const MoveToNewShipmentWrapperStyle: string = css`
  display: flex;
  align-items: center;
  color: ${colors.TEAL_DARK};
  ${fontSizes.SMALL};
  ${shadows.HEADER_RIGHT};
  position: relative;
  height: 100%;
  padding: 0 20px;
`;

export const MoveToShipmentButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  align-items: center;
  padding: 0 0 0 20px;
  grid-gap: 10px;
`;

export const MoveToShipmentSuccessPanelWrapperStyle: string = css`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: ${colors.TEAL};
  ${shadows.HEADER};
  z-index: 1;
`;

export const MoveToShipmentSuccessCloseButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.HUGE};
  color: ${colors.WHITE};
  width: 50px;
  height: 50px;
  &:hover,
  :focus {
    color: ${colors.TEAL_DARK};
  }
`;

export const PanelWrapperStyle = css`
  ${layout.LAYOUT};
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  background: ${colors.GRAY_SUPER_LIGHT};
  position: relative;
  color: ${colors.GRAY_DARK};
`;

export const Panel = styled('div')`
  ${PanelWrapperStyle};
`;

export const MoveToShipmentPanelWrapper = styled('div')`
  ${PanelWrapperStyle};
  display: grid;
  grid-auto-columns: auto;
  grid-auto-flow: column;
`;

export const SuccessPanelWrapper = styled('div')`
  ${PanelWrapperStyle};
  display: flex;
  justify-content: space-between;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
`;

export const CenterPanel = styled('div')`
  ${PanelWrapperStyle};
  justify-content: center;
`;

export const ConnectLogoStyle = css`
  position: absolute;
  left: 0;
  top: 0;

  margin-left: 20px;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const LabelConfirmDeleteStyle = css`
  white-space: normal;
  text-align: center;
`;
export const LabelConnectStyle = css`
  width: min-content;
  min-width: 120px;
  padding: 0;
  text-transform: uppercase;
  color: inherit;
`;

export const GroupLabelButtonStyle = css`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-column-gap: 10px;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: inherit;
`;

export const FlatButtonStyle = css`
  background: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY_DARK};
`;

export const GroupLabelButtonLeftStyle = css`
  ${GroupLabelButtonStyle};
  justify-content: left;
`;

export const SubPanel = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  height: 100%;
  /* &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    box-shadow: 5px 0 10px 0 rgba(0, 0, 0, 0.1);
  }
    ${shadows.HEADER};
  } */
`;

export const SuccessPanelButtonCloseStyle = css`
  cursor: pointer;
  user-select: none;
  color: inherit;
  &:hover {
    color: ${colors.TEAL};
  }
`;

export const PanelButtonStyle = css`
  min-width: unset;
`;

export const ConfirmLabelStyle = css`
  white-space: normal;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CurrencyLabelStyle = css`
  margin: 1px 0;
  font-weight: bold;
  color: ${colors.TEAL};
`;

export const ConfirmMessageContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ConfirmActionStyle = css`
  color: ${colors.TEAL};
`;
