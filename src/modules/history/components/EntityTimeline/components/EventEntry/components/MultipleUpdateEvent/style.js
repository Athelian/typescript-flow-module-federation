// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  colors,
  transitions,
  fontSizes,
  fontSizesWithHeights,
  borderRadiuses,
} from 'styles/common';

export const MultipleUpdateEventWrapperStyle = css`
  ${layout.VERTICAL};
  width: 100%;
`;

export const ButtonStyle = css`
  position: relative;
  ${layout.VERTICAL};
  cursor: pointer;
  ${transitions.MAIN};
  ${borderRadiuses.MAIN};
  padding: 0 20px 0 0;
  &:hover {
    & > svg {
      color: ${colors.TEAL};
    }
  }
`;

export const DateStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  user-select: none;
`;

export const MessageStyle = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  padding-top: 3px;
  flex: 1;
`;

export const ChevronStyle = (isExpanded: boolean) => css`
  position: absolute;
  right: 0;
  top: 0;
  flex-shrink: 0;
  ${transitions.EXPAND};
  ${fontSizes.LARGE};
  color: ${colors.GRAY_LIGHT};
  transform: rotate(${isExpanded ? '0' : '90'}deg);
`;

export const UpdateListStyle = css`
  ${layout.VERTICAL};
  padding: 0 0 0 10px;
  margin: 0 0 0 10px;
  border-left: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;

export const ChangeStyle = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  margin: 3px 0;
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
  padding: 0 3px;
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
  padding: 0 3px;
`;
