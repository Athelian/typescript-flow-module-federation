// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors } from 'styles/common';

export const CompletedByWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const CompletedByStyle: string = css`
  ${fontSizes.SMALL};
  min-height: 12px;
  max-height: 12px;
  line-height: 12px;
  ${presets.ELLIPSIS};
  text-align: right;
`;

export const CompletedAtStyle: string = css`
  ${fontSizes.MAIN};
  min-height: 18px;
  max-height: 18px;
  line-height: 18px;
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: right;
`;

export const StatusWrapperStyle = (completed: boolean) => css`
  position: relative;
  width: 175px;
  margin: 0 5px;
  height: 40px;
  ${borderRadiuses.BUTTON};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${completed ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
`;

export const StatusIconStyle: string = css`
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
