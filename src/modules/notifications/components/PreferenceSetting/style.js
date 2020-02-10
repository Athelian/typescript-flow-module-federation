// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export const GroupSettingWrapperStyle: string = css`
  ${layout.HORIZONTAL};
`;

export const LeftWrapperStyle: string = css`
  ${layout.VERTICAL};
  width: 150px;
`;

export const GroupIconStyle = (color: string): string => css`
  position: sticky;
  top: -50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  color: ${colors[color]};
  font-size: 64px;
  opacity: 0.5;
`;

export const PreferencesWrapperStyle: string = css`
  padding: 40px 0;
  margin: 0 150px 0 0;
  width: 300px;
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;
