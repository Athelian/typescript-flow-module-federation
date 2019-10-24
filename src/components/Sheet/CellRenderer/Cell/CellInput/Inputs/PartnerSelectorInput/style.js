// @flow
import { css } from 'react-emotion';
import {
  colors,
  presets,
  fontSizes,
  shadows,
  borderRadiuses,
  layout,
  transitions,
} from 'styles/common';

export const PartnerSelectorInputWrapperStyle: string = css`
  padding: 5px;
`;

export const PartnerSelectorCardStyle: string = css`
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  border-bottom-right-radius: 0;
  cursor: pointer;
  position: relative;
  display: flex;
  width: 100%;
  min-width: 40px;
  height: 20px;
  ${transitions.MAIN};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover,
  :focus {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const PlusButtonStyle: string = css`
  ${layout.VERTICAL};
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(0, 0, 0, 0.2);
`;

export const CornerIconStyle: string = css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${colors.WHITE};
  background: ${colors.PARTNER};
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 0 5px 0 5px;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 20px;
    width: 10px;
    height: 10px;
    border-radius: 0 5px 0 0;
    box-shadow: 5px 0 0 0 ${colors.PARTNER};
    z-index: 0;
  }
`;
