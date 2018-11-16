// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars, shadows } from 'styles/common';

const ResetOptionWrapperStyle: string = css`
  list-style-type: none;
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 5px;
  right: 1px;
  overflow: hidden;
  z-index: 1;
  min-width: min-content;
`;

export const OptionWrapperStyle = (width: string, height: string): string => css`
  & > div {
    ${ResetOptionWrapperStyle};
    display: flex;
    flex-flow: column;
    ${shadows.INPUT};
    min-width: ${width};
    max-width: ${width};
    background: #fff;
    ${borderRadiuses.MAIN};
    max-height: ${height};
    overflow-x: hidden;
    overflow-y: auto;
    ${scrollbars.SMALL};
  }
`;

type OptionProps = {
  onHover: boolean,
  selected: boolean,
  align: 'left' | 'right' | 'center',
  type: 'standard' | 'label',
};

export const OptionStyle = ({ onHover, selected, align, type }: OptionProps): string => css`
  width: 100%;
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : '#fff'};
  ${presets.BUTTON};
  ${align === 'left' && 'justify-content: flex-start'};
  ${align === 'right' && 'justify-content: flex-end'};
  ${align === 'center' && 'justify-content: space-around'};
  padding: 5px;
  flex: 1;
  ${presets.ELLIPSIS};
  flex-shrink: 0;
  ${type === 'label'
    ? `
    color: ${selected ? colors.TEAL : colors.GRAY_DARK};
    ${fontSizes.SMALL};
    letter-spacing: 2px;
    text-transform: uppercase;
  `
    : `
    color: ${selected ? colors.TEAL : colors.BLACK};
    ${fontSizes.MAIN};
    font-weight: bold;
  `};
`;
