// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const UploadPlaceholderStyle = (height: string): string => css`
  ${presets.BOX};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: ${height};
  color: ${colors.TEAL};
  font-size: 24px;
`;

export const ProgressStyle: string = css`
  font-weight: bold;
  color: ${colors.TEAL};
  font-size: 24px;
  text-align: center;
  padding: 40px 0 20px 0;
`;
