// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors } from 'styles/common';

type AvatarWrapper = {
  width: string,
  height: string,
};

export const AvatarWrapperStyle = ({ width, height }: AvatarWrapper): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: ${width};
  height: ${height};
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  ${fontSizes.MAIN};
  background-color: ${colors.GRAY_LIGHT};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  user-select: none;
`;

export default AvatarWrapperStyle;
