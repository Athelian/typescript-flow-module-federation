// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars } from 'styles/common';

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
