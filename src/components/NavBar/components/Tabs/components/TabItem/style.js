// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, transitions } from 'styles/common';

export const TabItemStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  position: relative;
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  ${transitions.MAIN};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  width: 100%;
  height: 50px;
  text-transform: uppercase;
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  background-color: ${colors.TRANSPARENT};
  & > span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    min-height: 4px;
    width: ${isActive ? '100%' : '0px'};
    background-color: ${isActive ? colors.TEAL : colors.TRANSPARENT};
    ${transitions.MAIN};
  }
  &:hover,
  &:focus {
    color: ${isActive ? colors.TEAL_DARK : colors.GRAY_DARK};
    & > span {
      width: 100%;
      background-color: ${isActive ? colors.TEAL_DARK : colors.GRAY_LIGHT};
    }
  }
`;

export const DisabledStyle: string = css`
  ${TabItemStyle(false)};
`;

export const IconStyle: string = css`
  margin: 0 5px 0 0;
`;
