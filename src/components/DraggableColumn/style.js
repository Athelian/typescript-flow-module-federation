// @flow
import { css } from 'react-emotion';
import {
  borderRadiuses,
  colors,
  fontSizes,
  layout,
  presets,
  shadows,
  transitions,
} from 'styles/common';

export const ColumnStyle = (dragging: boolean) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  line-height: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
  user-select: none;
  & > i {
    ${layout.LAYOUT};
    ${layout.CENTER_CENTER};
    opacity: 0;
    color: ${colors.GRAY_LIGHT};
    ${fontSizes.MAIN};
    width: 30px;
    height: 30px;
    ${transitions.MAIN};
  }
  & > span {
    ${presets.ELLIPSIS};
    margin-left: 10px;
    flex: 1;
  }
  ${dragging &&
    `
    ${shadows.INPUT};
    & > i {
      color: ${colors.BLUE};
      opacity: 1;
    }
  `}
  &:hover {
    ${shadows.INPUT};
    & > i {
      opacity: 1;
    }
  }
`;
