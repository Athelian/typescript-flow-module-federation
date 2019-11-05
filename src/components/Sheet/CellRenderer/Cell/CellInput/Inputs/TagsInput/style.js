// @flow
import { css } from 'react-emotion';
import { scrollbars, colors, fontSizes, layout } from 'styles/common';

export const TagsInputWrapperStyle = css`
  & > div {
    width: 100%;
    height: 30px;
  }
`;

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
  padding: 5px 0 0 0;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    border: none;
  }

  & > div {
    margin-right: 5px;
  }

  & > input {
    ${fontSizes.MAIN};
    color: ${colors.BLACK};
    border: none;
    font-weight: bold;
    background-color: transparent;
    min-width: 80px;
    &:focus {
      outline: none;
    }
  }
`;
