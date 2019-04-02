// @flow
import { css } from 'react-emotion';
import { colors, transitions, presets, borderRadiuses } from 'styles/common';

export const ActionCardWrapperStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  ${borderRadiuses.MAIN};
`;

export const DisabledWrapper: string = css`
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: ${colors.WHITE};
  opacity: 0.3;
`;

export const ActionWrapperStyle = (targeted: boolean): string => css`
  flex: 1;
  z-index: 2;
  ${presets.BUTTON};
  height: 100%;
  color: ${targeted ? colors.WHITE : colors.GRAY_DARK};
  ${transitions.MAIN};
  background-color: ${targeted ? colors.TEAL : colors.TRANSPARENT};
  &:first-child {
    ${borderRadiuses.MAIN};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child {
    ${borderRadiuses.MAIN};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &:hover {
    color: ${colors.WHITE};
    background-color: ${targeted ? colors.TEAL_DARK : colors.TEAL};
    opacity: 1;
  }
`;

export const RotateIcon: string = css`
  transform: rotate(90deg);
`;
