// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors, borderRadiuses, scrollbars, shadows } from 'styles/common';

export const DialogStyle: string = css`
  padding: 20px;
`;

export const ContentStyle: string = css`
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
`;

export const FooterStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  padding: 20px 0 0 0;
  justify-content: center;
  grid-gap: 10px;
`;

export const TextAreaStyle: string = css`
  border: none;
  padding: 0;
  width: 400px;
  height: 65px;
  line-height: 20px;
  padding: 0 4px;
  background: none;
  ${borderRadiuses.MAIN};
  resize: none;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: auto;
  ${shadows.INPUT};

  &:focus {
    outline: none;
    border-color: ${colors.TEAL};
  }
  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;
