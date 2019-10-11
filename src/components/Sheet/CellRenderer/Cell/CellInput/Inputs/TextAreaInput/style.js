// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses, scrollbars, shadows } from 'styles/common';

export const DialogStyle: string = css`
  padding: 20px;
`;

export const ContentStyle: string = css`
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const TextAreaStyle: string = css`
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

  ${fontSizes.MAIN};
  border: 1px solid rgba(0, 0, 0, 0.1);
  &:hover {
    ${shadows.INPUT};
  }
  &:focus {
    outline: none;
    border-color: ${colors.TEAL};
  }
  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;
