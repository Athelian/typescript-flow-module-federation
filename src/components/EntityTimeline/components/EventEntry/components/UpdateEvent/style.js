// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets, transitions, borderRadiuses } from 'styles/common';

export const UpdateEventWrapperStyle = css`
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

export const OldStyle = css`
  color: ${colors.BLACK};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 0 3px;
`;

export const NewStyle = css`
  color: #fff;
  background-color: ${colors.TEAL};
  ${borderRadiuses.MAIN};
  padding: 0 3px;
`;

export const TargetStyle = css`
  color: ${colors.PURPLE};
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

export const FieldStyle = css`
  color: ${colors.BLUE};
  ${borderRadiuses.MAIN};
`;
