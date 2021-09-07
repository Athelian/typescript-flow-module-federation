// @flow
import { css } from 'react-emotion';
import {
  layout,
  shadows,
  borderRadiuses,
  colors,
  fontSizes,
  fontSizesWithHeights,
} from 'styles/common';

export const LoginContainerStyle: string = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER};
  justify-content: space-between;
  overflow: hidden;
  padding-top: 20vh;
`;

export const LoginLogoStyle: string = css`
  width: 140px;
  padding: 10px 0;
`;

export const LoginLogoNameStyle: string = css`
  width: 200px;
  padding: 10px 0 40px 0;
`;

export const LoginBoxStyle: string = css`
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  background-color: #fff;
  padding: 20px;
  flex-shrink: 0;
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 20px;
  justify-items: center;
`;

export const LoginButtonsStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
  width: 100%;
`;

export const ForgotPasswordStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.TEAL};
  margin-top: 20px;
`;

export const LoginFormWrapperStyle: string = css`
  position: relative;
`;

export const LoginErrorStyle: string = css`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  ${fontSizes.MAIN};
  color: ${colors.WHITE};
  background-color: ${colors.RED};
  ${borderRadiuses.MAIN};
  padding: 5px;
  width: 100%;
  text-align: center;
`;

export const LoginCopyrightStyle: string = css`
  ${layout.VERTICAL};
  justify-content: flex-end;
  padding: 20px 0;
  min-height: 60px;
  color: #fff;
  flex: 1;
`;

export const Separator: string = css`
  display: flex;
  width: 100%;
  flex-basis: 100%;
  align-items: center;
  color: #aaa;
  margin: 8px 0px;
  &:before,
  &:after {
    content: '';
    flex-grow: 1;
    background: #e5e5e5;
    height: 1px;
    margin: 0px 8px;
  }
`;
