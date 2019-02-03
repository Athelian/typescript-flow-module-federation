// @flow
import { css } from 'react-emotion';
import { colors, presets } from 'styles/common';

export const OverlayStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
`;

export const CardWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  // background-color: rgba(255, 255, 255, 0.8);
`;

export const DisabledWrapper = css`
  flex: 1;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  background-color: ${colors.WHITE};
  opacity: 0.3;
`;
export const ActionWrapperStyle: string = css`
  ${presets.BUTTON};
  opacity: 0;
  flex: 1;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${colors.GRAY_DARK};

  transition: background-color 0.2s linear;
  background-color: ${colors.TRANSPARENT};
  &:hover {
    color: ${colors.WHITE};
    background-color: ${colors.TEAL};
    opacity: 1;
  }
`;
