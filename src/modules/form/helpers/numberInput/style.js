// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, fontSizes, presets, shadows } from 'styles/common';

export const CalculatorButtonWrapperStyle: string = css`
  position: absolute;
  top: 0;
  right: -35px;
`;

export const CalculatorButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.WHITE};
  background-color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;
