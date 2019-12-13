// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, transitions, fontSizes, colors, presets } from 'styles/common';

export const SearchStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  width: 200px;
  height: 30px;
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  flex: 1;
  height: 20px;
  padding: 0 4px;
  background: none;
  border: none;
  font-weight: bold;
  outline: none;
`;

export const SeparatorStyle: string = css`
  background: ${colors.GRAY_VERY_LIGHT};
  width: 1px;
  height: 20px;
  border: none;
`;

export const SearchButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover,
  &:focus {
    color: ${colors.TEAL};
  }
`;

export const ClearButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;
