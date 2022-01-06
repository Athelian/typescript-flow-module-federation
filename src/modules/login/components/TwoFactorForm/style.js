// @flow
import { css } from 'react-emotion';
import { shadows, borderRadiuses, colors, fontSizes } from 'styles/common';

export const TwoFactorBoxStyle: string = css`
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  background-color: #fff;
  padding: 30px 25px;
  flex-shrink: 0;
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 22px;
`;

export const LoginTitleStyle: string = css`
  ${fontSizes.GIANT};
  color: black;
`;

export const LoginTextStyle: string = css`
  ${fontSizes.MAIN};
`;

export const RecoverCodeStyle: string = css`
  ${borderRadiuses.MAIN};
  border: 1px solid ${colors.GRAY_LIGHT};
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: ${colors.GRAY_LIGHT};
  width: 100%;
`;

export const LoginResendStyle: string = css`
  color: ${colors.TEAL};

  &:hover {
    cursor: pointer;
  }
`;

export const RadioWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border: 1px solid ${colors.GRAY_LIGHT};
  padding: 14px;
`;

export const LoginDescriptionStyle: string = css`
  margin-left: 40px;
`;

export const RadioTextStyle: string = css`
  ${fontSizes.MAIN};
  white-space: nowrap;
`;

export const ButtonStyle = (isCancel: boolean) => css`
  ${borderRadiuses.MAIN};
  ${isCancel &&
    css`
      border: 1px solid ${colors.GRAY_LIGHT};
    `}
`;
