// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars, shadows } from 'styles/common';

type OptionWrapperType = {
  width: string,
  height: string,
  dropDirection: 'down' | 'up',
  align: 'left' | 'right' | 'center',
};

export const OptionWrapperStyle = ({
  width,
  height,
  dropDirection,
}: OptionWrapperType): string => css`
  & > div {
    list-style-type: none;
    position: absolute;
    ${dropDirection === 'down'
      ? `
      top: calc(100% + 5px)
    `
      : `
      bottom: calc(100% + 5px)
    `};
    right: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 1;
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

type OptionalProps = {
  onHover: boolean,
  selected: boolean,
  align: 'left' | 'right' | 'center',
  type: 'standard' | 'label',
};

export const OptionStyle = ({ onHover, selected, align, type }: OptionalProps): string => css`
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
