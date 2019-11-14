// @flow
import { css } from 'react-emotion';
import { scrollbars, colors, fontSizes, layout, presets } from 'styles/common';

export const TagsInputWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  width: 100%;

  & > div {
    width: 100%;
    height: 30px;
  }
`;

export const RemoveButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MEDIUM};
  color: ${colors.WHITE};

  &:focus,
  &:hover {
    color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const TagsSelectStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${scrollbars.SMALL};
  width: 100%;
  overflow-x: auto;
  padding: 5px 0 0 5px;

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
