// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

type ButtonStyleProps = {
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
  borderRadius: ?string,
};

export const ButtonStyle = ({
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  borderRadius,
}: ButtonStyleProps): string => css`
  ${presets.BUTTON};
  ${borderRadius ? `border-radius: ${borderRadius}` : borderRadiuses.BUTTON};
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
