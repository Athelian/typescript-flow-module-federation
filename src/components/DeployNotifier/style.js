// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes} from 'styles/common';

export const ToastWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  padding: 0;
  box-shadow: 0 0 200px rgba(0, 0, 0, 0.5);
`;

export const ToastBodyStyle: string = css`
  margin: 0;
  padding: 0;
`;

export const ToastButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  width: 100%;
  height: 100%;
  ${borderRadiuses.MAIN};
  border-bottom: solid 5px ${colors.TEAL};
  background-color: ${colors.WHITE};
  justify-content: flex-end;
  padding: 0 0 0 60px;
  & > div {
    color: ${colors.GRAY_LIGHT};
  }
  &:hover {
    color: ${colors.TEAL};
    & > div {
      color: ${colors.TEAL};
    }
  }
`;

export const ToastButtonIconStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.LARGE};
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;
