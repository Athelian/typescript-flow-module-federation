// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, transitions, presets, fontSizes, scrollbars } from 'styles/common';
import { StyledInputWrapperStyle } from 'components/Form/StyledInputs/style';

export const ResetNativeStyle = css`
  position: relative;
`;

export const ResetOptionWrapperStyle = css`
  list-style-type: none;
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 5px;
  overflow: hidden;
  z-index: 1;
  min-width: min-content;
`;

export const ResetOptionStyle = css`
  min-width: min-content;
  width: 100%;
  white-space: nowrap;
`;

export const SelectWrapperStyle = (
  hasError: boolean,
  isOpen: boolean,
  forceHoverStyle: boolean,
  width: ?string,
  disabled: boolean
) => css`
  ${ResetNativeStyle};
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

export const OptionWrapperStyle = css`
  ${ResetOptionWrapperStyle};
  display: flex;
  flex-flow: column;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 200px;
  background: #fff;
  ${borderRadiuses.MAIN};
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const OptionStyle = (onHover: boolean, selected: boolean) => css`
  ${ResetOptionStyle};
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : '#fff'};
  ${presets.BUTTON};
  justify-content: flex-start;
  padding: 10px 5px;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  ${presets.ELLIPSIS};
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
  height: 100%;
  cursor: pointer;
  color: ${colors.GRAY};
  font-size: 12px;
`;
