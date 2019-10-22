// @flow
import { css } from 'react-emotion';
import { scrollbars, colors, fontSizes, layout } from 'styles/common';

export const RemoveButtonStyle = css`
  ${fontSizes.MEDIUM};
  cursor: pointer;
  color: inherit;
`;

export const TagsSelectStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${scrollbars.SMALL};
  width: 100%;
  overflow-x: auto;
  padding: 0 0 0 5px;
  & > div {
    margin-right: 5px;
  }

  & > input {
    ${fontSizes.MAIN};
    color: ${colors.BLACK};
    border: none;
    font-weight: bold;
    padding: 5px 0 5px 0;
    background-color: transparent;
    min-width: 80px;
    &:focus {
      outline: none;
    }
  }
`;
