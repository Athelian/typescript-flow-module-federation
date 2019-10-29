// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const DateToggleInputWrapperStyle: string = css`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 30px;
  justify-items: center;
`;

export const DateToggleInputReadonlyWrapperStyle: string = css`
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

export const ReadonlyDateStyle: string = css`
  ${presets.ELLIPSIS};
  width: 100%;
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 0 0 0 5px;
  height: 30px;
  line-height: 30px;
`;
