// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars, shadows } from 'styles/common';

export const OptionWrapperStyle = (width: string, height: string): string => css`
  & > div {
    list-style-type: none;
    position: absolute;
    margin: 0;
    padding: 0;
    margin-top: 5px;
    overflow: hidden;
    z-index: 1;
    min-width: min-content;
    ${shadows.INPUT};
    min-width: ${width};
    max-width: ${width};
    background: ${colors.WHITE};
    ${borderRadiuses.MAIN};
    max-height: ${height};
    ${scrollbars.SMALL};
    cursor: pointer;
  }
`;

type OptionProps = {
  onHover: boolean,
  selected: boolean,
  align: 'left' | 'right' | 'center',
  type: 'standard' | 'label',
};

export const OptionStyle = ({ onHover, selected, align, type }: OptionProps): string => css`
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  text-align: ${align};
  line-height: 20px;
  padding: 5px;
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
