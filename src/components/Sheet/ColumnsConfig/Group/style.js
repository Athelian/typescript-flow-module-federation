// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, layout, shadows, transitions } from 'styles/common';

export const WrapperStyle = (color: string): string => css`
  ${layout.HORIZONTAL};
  border-left: 4px solid ${colors[color]};
`;

export const LeftWrapperStyle: string = css`
  ${layout.VERTICAL};
  width: 150px;
`;

export const IconStyle = (color: string): string => css`
  position: sticky;
  top: -100px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  color: ${colors[color]};
  font-size: 64px;
  opacity: 0.5;
`;

export const ActionsWrapperStyle: string = css`
  position: sticky;
  top: calc(100% - 30px);
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  width: 100%;
  height: min-content;
  padding: 40px 0 20px 0;
  justify-items: center;
  background: linear-gradient(to bottom, ${colors.TRANSPARENT}, ${colors.WHITE} 20%);
  & > button {
    width: 100px;
  }
`;

export const ColumnsWrapperStyle: string = css`
  padding: 40px 10px;
  width: 220px;
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;

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
    margin-left: 10px;
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
