// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes } from 'styles/common';

type ButtonStyleType = {
  disabled: boolean,
  color: string,
};

export const ButtonStyle = ({ disabled, color }: ButtonStyleType): string => css`
  width: min-content;
  height: min-content;
  margin-left: auto;
  margin-right: 0;
  border-top-left-radius: 999px;
  border-bottom-left-radius: 999px;
  display: flex;
  cursor: pointer;
  ${disabled && 'cursor: not-allowed'};
  ${!disabled &&
    `
    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  `};
  white-space: nowrap;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  padding: 5px;
  ${transitions.EXPAND};
  line-height: 20px;
  ${fontSizes.SMALL};
`;

export const ButtonContentWrapperStyle = (visible: boolean): string => css`
  font-size: 1em;
  height: 100%;
  ${visible
    ? `
    opacity: 1;
    width: fit-content;
  `
    : `
    opacity: 0;
    width: 0;
    overflow: hidden;
  `};
  ${transitions.EXPAND};
`;
