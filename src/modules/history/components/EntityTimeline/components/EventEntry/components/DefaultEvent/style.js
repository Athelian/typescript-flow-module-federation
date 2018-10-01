// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets, transitions, borderRadiuses } from 'styles/common';

export const DefaultEventWrapperStyle = css`
  display: flex;
  flex-direction: column;
`;

export const EventStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding-top: 3px;
`;

export const DateStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  user-select: none;
`;

export const NameStyle = css`
  color: ${colors.BLACK};
  ${borderRadiuses.MAIN};
  cursor: pointer;
  ${transitions.MAIN};
  & > svg {
    color: ${colors.GRAY_DARK};
    font-size: 8px;
    margin: 0 0 3px 5px;
  }
  &:hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;
