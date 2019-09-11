// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const AutoDateWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const DateBindingSignWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const AutoDateSyncIconStyle: string = css`
  position: absolute;
  bottom: 5px;
  right: -25px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
`;

export const BindingToggleButtonStyle = css`
  position: absolute;
  right: -50px;
  top: 5px;
  & > div > svg {
    color: ${colors.GRAY_VERY_LIGHT};
  }
`;
