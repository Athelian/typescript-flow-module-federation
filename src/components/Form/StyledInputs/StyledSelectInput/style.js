// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, transitions } from 'styles/common';
import { StyledInputWrapperStyle } from 'components/Form/StyledInputs/style';

export const SelectWrapperStyle = (
  hasError: boolean,
  isOpen: boolean,
  forceHoverStyle: boolean,
  width: ?string,
  disabled: boolean
) => css`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  ${borderRadiuses.MAIN};
  border: 1px solid transparent;
  border-color: ${hasError && colors.RED};
  border-color: ${isOpen && '#11D1A6'};
  ${transitions.MAIN};
  align-items: center;
  width: ${width || '100%'};
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  cursor: pointer;
  ${(isOpen || forceHoverStyle) && 'box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)'};
  background: #fff;

  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }

  ${StyledInputWrapperStyle(isOpen, hasError, disabled, forceHoverStyle, width || '100%')};
`;

export const InputStyle = css`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.BLACK};
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: transparent;
`;

export const ButtonStyle = css`
  outline: none;
  border: none;
  height: 100%;
  cursor: pointer;
  background: transparent;
  color: ${colors.GRAY};
  font-size: 12px;
  display: flex;
  align-items: center;
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
  height: 100%;
  cursor: pointer;
  color: ${colors.GRAY};
  font-size: 12px;
`;
