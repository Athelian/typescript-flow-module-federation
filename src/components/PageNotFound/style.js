// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const PageNotFoundWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const PageNotFoundMessageWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  width: 880px;
  padding: 100px 0 0 0;
`;

export const PageNotFoundIconStyle: string = css`
  color: ${colors.BLUE};
  font-size: 40px;
`;

export const PageNotFoundTitleStyle: string = css`
  color: ${colors.BLUE};
  font-size: 40px;
  letter-spacing: 6px;
  text-align: center;
  margin: 40px 0;
  font-weight: bold;
`;

export const PageNotFoundDescriptionStyle: string = css`
  color: ${colors.BLACK};
  font-size: 20px;
  line-height: 40px;
  letter-spacing: 4px;
  text-align: center;
`;

export const PageNotFoundGraphicsWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  & > div {
    width: 2000px;
    min-width: 100vw;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
`;

export const PageNotFoundGraphicStyle: string = css`
  width: 100%;
  flex: 1;
`;
