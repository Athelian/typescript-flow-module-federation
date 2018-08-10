// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, transitions } from 'styles/common';

export const OptionWrapperStyle = css`
  display: flex;
  flex-flow: column wrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

export const SelectWrapperStyle = (isError: boolean) => css`
  display: flex;
  flex-wrap: nowrap;
  ${borderRadiuses.MAIN};
  border: 1px solid ${isError ? colors.RED : 'transparent'};
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const OptionStyle = (onHover: boolean, selected: boolean) => css`
  background: ${onHover ? colors.TEAL_LIGHT : '#fff'};
  background-color: ${selected && colors.TEAL};
  color: ${selected ? '#fff' : colors.BLACK};
  padding: 8px;
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
  color: ${colors.GRAY};
  font-size: 12px;
`;

export const ClearButtonStyle = css`
  button {
    cursor: pointer;
    outline: none;
    border: none;
    color: ${colors.GRAY};
  }
`;

export const InputStyle = css`
  ${layout.HORIZONTAL};
  align-items: center;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  color: ${colors.BLACK};
  cursor: pointer;
  width: 100%;
  & > div {
    height: 100%;
    display: flex;
    align-items: center;
  }
  & > div:first-child {
    flex: 1;
  }
  &:not(:hover) {
    button {
      display: none;
    }
  }
`;
