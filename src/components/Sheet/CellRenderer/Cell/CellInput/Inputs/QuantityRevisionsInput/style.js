// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, borderRadiuses, presets, transitions } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  overflow: hidden;
`;

export const RevisionWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

export const SelectInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  width: 100px;

  & > span {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    font-weight: bold;
    padding: 0 5px;
    flex: 1;
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  height: 100%;
  cursor: pointer;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const OptionStyle = (highlighted: boolean, selected: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${selected ? colors.TEAL : colors.BLACK};
  background: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  width: 100%;
  height: 100%;
  font-weight: bold;
  padding: 0 5px;
`;

export const SeparatorStyle = css`
  height: 20px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 5px;
  border: none;
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  background: transparent;
  width: 70px;
  line-height: 18px;
  font-weight: 600;

  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;

export const RemoveButtonStyle = css`
  ${presets.BUTTON};
  color: rgba(0, 0, 0, 0.1);
  height: 30px;
  width: 20px;
  margin-right: 5px;

  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;

export const AddButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.WHITE};
  background-color: ${colors.TEAL};
  letter-spacing: 2px;
  text-transform: uppercase;
  height: 20px;
  width: min-content;
  padding: 0 10px;
  margin: 0 5px;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;
