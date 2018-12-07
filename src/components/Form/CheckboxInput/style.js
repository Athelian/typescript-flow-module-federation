// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, borderRadiuses } from 'styles/common';

export const CheckboxInputStyle = (checked: boolean): string => css`
  ${presets.BUTTON};
  grid-gap: 5px;
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN_INSIDE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  ${checked
    ? `
    color: ${colors.TEAL};
    background-color: ${colors.WHITE};
    &:hover, :focus {
      color: rgba(0, 0, 0, 0.2);
    }
  `
    : `
    color: rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
    &:hover, :focus {
      color: ${colors.TEAL};
    }
  `};
`;

export default CheckboxInputStyle;
