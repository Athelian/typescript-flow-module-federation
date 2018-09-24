// @flow
import { css } from 'react-emotion';
import { layout, shadows, borderRadiuses, gradients, colors } from 'styles/common';

export const LoginContainerStyle: string = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER};
  justify-content: space-between;
  background: ${gradients.BLUE_TEAL_DIAGONAL};
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
  max-width: 360px;
  min-width: 240px;
  padding: 20px;
  flex-shrink: 0;
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 20px;
`;

export const LoginErrorStyle: string = css`
  color: ${colors.RED};
  align-self: center;
`;

export const LoginCopyrightStyle: string = css`
  ${layout.VERTICAL};
  justify-content: flex-end;
  padding: 20px 0;
  min-height: 60px;
  color: #fff;
  flex: 1;
`;

export const LoggingInStyle: string = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  background: ${gradients.BLUE_TEAL_DIAGONAL};
  color: ${colors.GRAY_SUPER_LIGHT};
  font-size: 24px;
  overflow: hidden;
`;
