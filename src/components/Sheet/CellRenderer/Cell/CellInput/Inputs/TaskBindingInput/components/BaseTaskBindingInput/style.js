// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const TaskBindingInputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
`;

export const DateInputWrapperStyle = (binding: boolean) => css`
  display: flex;
  align-items: center;
  width: 125px;
  height: 30px;
  flex-shrink: 0;
  ${binding
    ? `
    background: rgba(0, 0, 0, 0.025);
  `
    : `
    padding: 0 0 0 5px;
  `};
`;

export const BindingIconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  flex-shrink: 0;
`;

export const BindingToggleWrapperStyle = css`
  flex-shrink: 0;
`;

export const BindingInputsWrapperStyle = css`
  flex: 1;
  display: grid;
  grid-template-columns: 80px 80px 75px 1fr;
  padding: 0 0 0 5px;
`;
