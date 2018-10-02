// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const OrderHeaderStyle = (archived: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  grid-template-columns: 20px 1fr;
  margin: 5px 0;
  ${fontSizes.MAIN};
  height: 22px;
  line-height: 22px;
  letter-spacing: 2px;
  > * {
    height: 22px;
  }
`;

export const OrderHeaderCheckBoxButtonStyle = (archived: boolean) => css`
  cursor: pointer;
  user-select: none;
  border: 3px solid ${archived ? colors.TEAL : 'transparent'};
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
  transition: all 0.1s linear;
  &:focus {
    outline: 0;
  }
  font-size: 10px;
  line-height: 10px;
  width: min-content;
  padding: 2px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  background-color: transparent;
  &:hover,
  :focus {
    color: ${archived ? colors.GRAY_DARK : colors.TEAL_DARK};
  }
`;
