// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, shadows, colors, presets, borderRadiuses } from 'styles/common';

export const ContainerStyle: string = css`
  ${layout.VERTICAL};
`;

export const HeaderStyle: string = css`
  ${layout.HORIZONTAL};
  ${shadows.HEADER};
  ${fontSizes.LARGE};
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 20px;
  color: ${colors.GRAY_DARK};
  letter-spacing: 0.2em;
`;

export const HeaderIconStyle: string = css`
  font-size: 18px;
`;

export const CancelButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  height: 20px;
  width: 20px;
  font-size: 18px;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  &:hover,
  &:focus {
    color: ${colors.GRAY_DARK};
  }
`;

export const MainStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
  padding: 40px 20px;
`;
