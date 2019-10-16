// @flow
import { css } from 'react-emotion';
import { borderRadiuses, transitions, scrollbars, colors, fontSizes } from 'styles/common';

export const RemoveButtonStyle = css`
  cursor: pointer;
  color: inherit;
  ${fontSizes.MEDIUM};
`;

export const TagsSelectStyle = css`
  display: flex;
  align-items: center;
  position: relative;
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};

  white-space: nowrap;
  overflow-x: auto;
  ${scrollbars.SMALL};
  padding: 0 0 0 5px;
  & > div {
    margin-right: 5px;
  }
  input {
    color: ${colors.BLACK};
    ${fontSizes.MAIN};
    border: none;
    font-weight: bold;
    padding: 5px 0 5px 0;
    background-color: transparent;
    min-width: 80px;
    flex: 1;
    &:focus {
      outline: none;
    }
  }
`;
