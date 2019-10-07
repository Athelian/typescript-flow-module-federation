// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, borderRadiuses } from 'styles/common';

export const CheckboxInputStyle = (checked: boolean): string => css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN_INSIDE};
  width: 20px;
  height: 20px;

  color: ${colors.WHITE};
  background-color: ${checked ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  &:hover,
  :focus {
    background-color: ${checked ? colors.TEAL_DARK : colors.GRAY_LIGHT};
  }

  &[disabled] {
    cursor: default;
    color: ${colors.GRAY_SUPER_LIGHT};
    background-color: ${checked ? colors.TEAL_DARK : colors.GRAY};
  }
`;

export default CheckboxInputStyle;
