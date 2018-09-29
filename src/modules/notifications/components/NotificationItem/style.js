// @flow
import { css } from 'react-emotion';
import { colors, layout, transitions, fontSizes, borderRadiuses } from 'styles/common';

export const WrapperStyle = (read: boolean) => css`
  ${layout.HORIZONTAL};
  background-color: ${read ? '#fff' : colors.GRAY_SUPER_LIGHT};
  padding: 10px;
  cursor: pointer;
  width: 100%;
  min-width: min-content;
  flex-shrink: 0;
  ${transitions.MAIN};
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
  }
  &:focus {
    outline: none;
  }
`;

export const AvatarStyle = (imgPath: string) => css`
  position: relative;
  background-image: url(${imgPath});
  background-size: cover;
  ${borderRadiuses.CIRCLE};
  width: 40px;
  height: 40px;
  margin-right: 10px;
  flex-shrink: 0;
`;

export const IconWrapperStyle = css`
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 3px;
  background-color: ${colors.TEAL};
  color: #fff;
  ${borderRadiuses.CIRCLE};
  font-size: 11px;
`;

export const InfoWrapper = css`
  ${layout.VERTICAL};
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  & > span {
    color: ${colors.GRAY_DARK};
    ${fontSizes.SMALL};
  }
`;
