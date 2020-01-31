// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

type AvatarWrapper = {
  width: string,
  height: string,
};

export const AvatarWrapperStyle = ({ width, height }: AvatarWrapper): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.WHITE};
  width: ${width};
  height: ${height};
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  ${fontSizes.MAIN};
  background-color: ${colors.GRAY_LIGHT};
  ${shadows.FAINT};
  user-select: none;
`;

export default AvatarWrapperStyle;
