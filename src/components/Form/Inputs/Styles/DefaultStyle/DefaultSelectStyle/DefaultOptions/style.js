// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars } from 'styles/common';

const ResetOptionWrapperStyle: string = css`
  list-style-type: none;
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 5px;
  overflow: hidden;
  z-index: 1;
  min-width: min-content;
`;

const ResetOptionStyle: string = css`
  min-width: min-content;
  width: 100%;
  white-space: nowrap;
`;

export const OptionWrapperStyle = (width: string, height: string): string => css`
  ${ResetOptionWrapperStyle};
  display: flex;
  flex-flow: column;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  min-width: ${width};
  max-width: ${width};
  background: #fff;
  ${borderRadiuses.MAIN};
  max-height: ${height};
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const OptionStyle = (
  onHover: boolean,
  selected: boolean,
  align: 'left' | 'right' | 'center'
): string => css`
  ${ResetOptionStyle};
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : '#fff'};
  ${presets.BUTTON};
  ${align === 'left' && 'justify-content: flex-start'};
  ${align === 'right' && 'justify-content: flex-end'};
  ${align === 'center' && 'justify-content: space-around'};
  padding: 5px;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  ${presets.ELLIPSIS};
  flex-shrink: 0;
`;
