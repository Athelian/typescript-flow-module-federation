// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

type ButtonStyleProps = {
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
};

export const ButtonWrapperStyle = ({
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
}: ButtonStyleProps): string => css`
  ${presets.BUTTON};
  color: ${colors[textColor]};
  background-color: ${colors[backgroundColor]};
  ${borderRadiuses.BUTTON};
  height: 30px;
  padding: 0 10px;
  width: min-content;
  min-width: 75px;
  flex-shrink: 0;
  &:hover,
  :focus {
    color: ${colors[hoverTextColor]};
    background-color: ${colors[hoverBackgroundColor]};
  }
`;

export const DisabledButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_DARK};
  background-color: ${colors.GRAY_LIGHT};
  ${borderRadiuses.BUTTON};
  height: 30px;
  padding: 0 10px;
  cursor: default;
  width: min-content;
  min-width: 75px;
  flex-shrink: 0;
`;

export const ButtonLabelStyle: string = css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  ${fontSizes.SMALL};
  text-transform: uppercase;
`;

export const ButtonLoadingWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
`;

export const ButtonIconStyle: string = css`
  margin: 0 0 0 5px;
  ${fontSizes.SMALL};
`;
