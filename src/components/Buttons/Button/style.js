// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const ButtonStyle = (
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string
): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors[textColor]};
  background-color: ${colors[backgroundColor]};
  height: 30px;
  padding: 0 10px;
  width: min-content;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  &:hover,
  :focus {
    color: ${colors[hoverTextColor]};
    background-color: ${colors[hoverBackgroundColor]};
  }

  &[disabled] {
    color: ${colors.GRAY_DARK};
    background-color: ${colors.GRAY_LIGHT};
    cursor: default;
  }
`;
