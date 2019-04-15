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
`;

export const LoginLogoContainerStyle: string = css`
  ${layout.CENTER};
  ${layout.VERTICAL};
  justify-content: flex-end;
  flex: 1.5;
  min-height: 200px;
  @media screen and (max-height: 600px) {
    margin-top: 10px;
  }
`;

export const LoginLogoStyle: string = css`
  width: 80px;
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
  grid-gap: 40px;
  justify-items: center;
`;

export const LoginButtonsStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
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
