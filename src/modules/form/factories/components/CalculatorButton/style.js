// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, fontSizes, presets } from 'styles/common';

export const CalculatorButtonStyle: string = css`
  position: absolute;
  top: 0;
  right: -40px;
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export default CalculatorButtonStyle;
