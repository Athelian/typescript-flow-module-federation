// @flow
import { css } from 'react-emotion';
import { colors, presets, borderRadiuses, layout, transitions, fontSizes } from 'styles/common';

export const SelectorWrapperStyle: string = css`
  padding: 5px;
`;

export const SelectorCardStyle: string = css`
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  background-color: ${colors.WHITE};
  border-bottom-right-radius: 0;
  cursor: pointer;
  position: relative;
  display: flex;
  width: 100%;
  min-width: 40px;
  height: 20px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:not([disabled]):hover,
  :not([disabled]):focus {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const PlusButtonStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER_CENTER};
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  ${fontSizes.LITTLE};
  width: 100%;
  height: 20px;
  color: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  &:hover,
  :focus {
    border-color: ${colors.TEAL};
    color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const CornerIconStyle: string = css`
  position: absolute;
  top: 0;
  right: 0;
`;
