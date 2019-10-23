// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const NumberToggleInputWrapperStyle: string = css`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 30px 35px;
  justify-items: center;
`;

export const NumberToggleInputReadonlyWrapperStyle: string = css`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 35px;
  justify-items: center;
`;

export const ReadonlyWrapperStyle: string = css`
  display: flex;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.025);
`;

export const ReadonlyNumberStyle: string = css`
  ${presets.ELLIPSIS};
  width: 100%;
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 0 0 0 5px;
  height: 30px;
  line-height: 30px;
`;

export const CalculatorIconStyle: string = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  flex-shrink: 0;
`;
