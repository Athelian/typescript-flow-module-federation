// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const PageNotFoundWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100vw - 200px);
  margin: 0 0 0 200px;
  overflow: hidden;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const PageNotFoundMessageWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const PageNotFoundTitleStyle: string = css`
  color: ${colors.BLUE};
  font-size: 40px;
  letter-spacing: 2px;
`;

export const PageNotFoundDescriptionStyle: string = css`
  color: ${colors.BLACK};
  font-size: 24px;
  letter-spacing: 2px;
`;

export const PageNotFoundGraphicsWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  & > div {
    width: 100%;
    height: 100%;
  }
`;

export const PageNotFoundGraphicStyle: string = css`
  width: 100%;
  height: 100%;
`;
