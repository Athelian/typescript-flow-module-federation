// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, scrollbars } from 'styles/common';

export const BaseWrapperStyle = css`
  display: flex;
`;

export const WrapperStyle = css`
  position: relative;
  display: block;
  width: 20em;
  height: 3em;
  line-height: 3;
  background: ${colors.TRANSPARENT};
  overflow: hidden;
  &::after {
    content: '\\25BC';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 0 1em;
    pointer-events: none;
    color: #fff;
  }
  &:hover::after {
    color: ${colors.BLACK};
  }
  &::after {
    ${transitions.MAIN};
  }
`;

export const SimpleDropDownStyle = (isError: boolean) => css`
  appearance: none;
  outline: 0;
  border: 0;
  margin: 0;
  box-shadow: none;
  position: relative;
  display: block;
  line-height: 3;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
  &[multiple] {
    overflow: auto;
    ${scrollbars.SMALL};
  }
  &[readonly] {
    cursor: not-allowed;
  }
  background: ${colors.TRANSPARENT};
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  ${isError && `border-bottom: 2px solid ${colors.RED}`};
`;
