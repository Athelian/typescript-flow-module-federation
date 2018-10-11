// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses } from 'styles/common';

export const TagFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const CloneButtonStyle: string = css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
  color: ${colors.WHITE};
  font-size: 11px;
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  &:hover {
    background-color: ${colors.BLUE};
  }
  outline: none;
`;

export default TagFormWrapperStyle;
