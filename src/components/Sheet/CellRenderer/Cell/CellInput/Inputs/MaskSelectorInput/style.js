// @flow
import { css } from 'react-emotion';
import { colors, presets, borderRadiuses, layout } from 'styles/common';

export const SelectorInputWrapperStyle: string = css`
  padding: 5px;
`;

export const ButtonSelectorStyle: string = css`
  ${presets.BUTTON};
  width: 100%;
  min-width: 40px;
  height: 20px;
`;

export const MaskCardStyle: string = css`
  ${layout.HORIZONTAL};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  overflow: hidden;
  border-bottom-right-radius: 0;
  flex: 1;
  height: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover,
  :focus {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const PlusButtonStyle: string = css`
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  ${borderRadiuses.MAIN};
  flex: 1;
  height: 20px;
  color: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  font-size: 10px;
  &:hover,
  :focus {
    border-color: ${colors.TEAL};
    color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
