// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const FileInfoWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 40px;
`;

export const FileIconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors[color]};
  font-size: 96px;
  width: 72px;
  height: 96px;
  margin: 0 0 0 85px;
`;

export const FileNameWrapperStyle: string = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  align-items: center;
  width: 200px;
  padding: 0 5px;
  height: 20px;
  line-height: 20px;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;
