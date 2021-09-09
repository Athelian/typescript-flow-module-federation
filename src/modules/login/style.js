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
  ${layout.VERTICAL};
  ${layout.CENTER};
  justify-content: center;
  height: 100vh;
`;

export const LoginLogoStyle: string = css`
  width: 140px;
  padding-top: 10px;
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
  grid-gap: 28px;
  justify-items: center;
`;

export const LoginButtonsStyle: string = css`
  ${layout.LAYOUT};
  ${layout.CENTER};
  width: 100%;
  justify-content: space-between;
`;

export const ForgotPasswordStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.TEAL};
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
  color: #fff;
  min-height: 60px;
  padding: 20px 0;
  @media screen and (min-height: 700px) {
    position: absolute;
    bottom: 0;
  }
`;

export const SsoStyle: string = css`
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 16px;
  justify-items: center;
  width: 100%;
  margin-top: -10px;
`;

export const Separator: string = css`
  ${layout.LAYOUT};
  width: 100%;
  flex-basis: 100%;
  align-items: center;
  color: #aaa;
  &:before,
  &:after {
    content: '';
    flex-grow: 1;
    background: #e5e5e5;
    height: 1px;
  }
  &:before {
    margin: 0px 8px 0px 0px;
  }
  &:after {
    margin: 0px 0px 0px 8px;
  }
`;

export const SsoButtonStyle: string = css`
  ${layout.LAYOUT};
  color: #555555;
  cursor: pointer;
  align-items: center;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #c2c8d0;
  padding: 6px 8px;
  font-size: 12px;
  &:hover {
    background-color: #eee;
  }
`;

export const LogoStyle: string = css`
  width: 14px;
  height: 14px;
  margin-right: 10px;
`;
