// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, transitions } from 'styles/common';

export const HeaderIconStyle = css`
  ${presets.BUTTON};
  position: relative;
  color: ${colors.ORDER};
  ${transitions.MAIN};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  width: 100%;
  height: 50px;
  border-bottom: 4px solid ${colors.ORDER};
  text-transform: uppercase;
  ${fontSizes.MEDIUM};
  letter-spacing: 2px;
  & > span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    min-height: 4px;
    width: '100%';
    background-color: ${colors.ORDER_DARK};
    ${transitions.MAIN};
  }
  &:hover,
  &:focus {
    color: ${colors.ORDER_DARK};
    & > span {
      width: 100%;
      background-color: ${colors.ORDER_DARK};
    }
  }
`;

export default HeaderIconStyle;
