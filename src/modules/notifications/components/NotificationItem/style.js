// @flow
import { css } from 'react-emotion';
import { colors, layout, transitions, fontSizes, borderRadiuses } from 'styles/common';

export const RowStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &:hover {
    background-color: ${colors.WHITE};
  }
`;

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  padding: 10px;
  cursor: pointer;
  width: 100%;
  min-width: min-content;
  flex-shrink: 0;
  ${transitions.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  & :hover {
    background-color: ${colors.WHITE};
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

export const DateTimeStyle = css`
  font-size: 12px;
  line-height: 15px;
  color: ${colors.GRAY_DARK};
`;

export const ActionButtonStyle = css`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  & :hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
  & > button {
    font-style: normal;
    font-weight: 900;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    min-width: 40px;
    height: 40px;
    padding: 0;
    & > :last-child {
      margin: 0;
    }
  }
`;
