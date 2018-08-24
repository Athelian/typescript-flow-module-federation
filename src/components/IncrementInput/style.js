// @flow
import { css } from 'react-emotion';
import { shadows, colors, presets, fontSizes, borderRadiuses } from 'styles/common';

export const IncrementInputWrapperStyle = () => css`
  height: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: 30px auto 30px;
  grid-gap: 10px;
`;

export const IncrementButtonStyle = () => css`
  height: 30px;
  width: 30px;
  ${shadows.TOOLTIP};
  color: ${colors.GRAY_LIGHT};
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  border-width: 0;
  & :hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const IncrementContentStyle = () => css`
  ${shadows.TOOLTIP};
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  text-align: center;
  font-weight: bold;
  ${borderRadiuses.BUTTON};
  border-width: 0;
`;
