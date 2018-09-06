// @flow
import { css } from 'react-emotion';
import { presets, transitions, colors, layout, fontSizes } from 'styles/common';

export const OrderFormWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const StatusStyle = (archived: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;

export const ToggleButtonStyle = css`
  ${presets.BUTTON};
  font-size: 20px;
  &:hover {
    & > svg {
      opacity: 0.8;
    }
  }
  & > svg {
    ${transitions.MAIN};
  }
  & > .fa-toggle-off {
    color: ${colors.GRAY_DARK};
  }
  & > .fa-toggle-on {
    color: ${colors.TEAL};
  }
`;
