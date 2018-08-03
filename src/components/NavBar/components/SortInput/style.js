// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, fontSizes, transitions, presets } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  position: relative;
  background: #fff;
  overflow: hidden;
  color: ${colors.GRAY_LIGHT};
  width: 150px;
  height: 30px;
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

export const SelectStyle = css`
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 0 10px;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY};
  padding: 0 10px 0 5px;
  height: 100%;
  outline: none;
  &:hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
  &:focus {
    background-color: ${colors.TEAL};
    color: #fff;
    border: none;
  }
`;

export const OptionWrapperStyle = css`
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

export const OptionItemStyle = (active: boolean, selected: boolean) => css`
  background: ${active ? '#eee' : '#fff'};
  background: ${selected && '#aaa'};
  height: 100%;
  width: 150px;
  color: ${selected ? '#fff' : '#555'};
  padding: 8px;
  cursor: pointer;
`;
