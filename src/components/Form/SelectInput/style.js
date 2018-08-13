// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses } from 'styles/common';

export const SelectWrapperStyle = (isError: boolean) => css`
  display: flex;
  flex-wrap: nowrap;
  ${borderRadiuses.MAIN};
  border: 1px solid ${isError ? colors.RED : 'transparent'};
  cursor: pointer;

  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const OptionWrapperStyle = css`
  display: flex;
  flex-flow: column wrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

export const InputStyle = css`
  ${layout.HORIZONTAL};
  align-items: center;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  width: 100%;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1;
    input {
      font-size: 14px;
      font-weight: bold;
      color: ${colors.BLACK};
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      background: transparent;
    }
  }
  button {
    outline: none;
    border: none;
    height: 100%;
    cursor: pointer;
    background: transparent;
    color: ${colors.GRAY};
    font-size: 12px;
    display: flex;
    align-items: center;
  }
  &:not(:hover) {
    button:first-child {
      display: none;
    }
  }
`;

export const OptionStyle = (onHover: boolean, selected: boolean) => css`
  background: ${onHover ? colors.TEAL_LIGHT : '#fff'};
  background-color: ${selected && colors.TEAL};
  color: ${selected ? '#fff' : colors.BLACK};
  padding: 8px;
`;
