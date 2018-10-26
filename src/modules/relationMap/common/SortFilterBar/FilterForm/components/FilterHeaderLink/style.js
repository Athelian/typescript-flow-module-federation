// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, transitions } from 'styles/common';

export const FilterHeaderLinkStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  ${transitions.MAIN};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  white-space: nowrap;
  width: 100%;
  height: 20px;
  line-height: 20px;
  ${fontSizes.MEDIUM};
  letter-spacing: 2px;
  background-color: transparent;

  &:hover,
  &:focus {
    color: ${isActive ? colors.TEAL_DARK : colors.GRAY_DARK};
  }

  > span {
    font-size: 16px;
    font-weight: bold;
  }
`;

export const DisabledStyle: string = css`
  ${FilterHeaderLinkStyle(false)};
`;

export const IconStyle: string = css`
  margin: 0 5px 0 0;
`;
