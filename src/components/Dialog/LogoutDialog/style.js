// @flow
import { css } from 'react-emotion';

export const DialogStyle = css`
  padding: 24px;
`;

export const ButtonsStyle = css`
  display: flex;
  justify-content: flex-end;
  button {
    font-size: 12px;
    color: #aaa;
    margin-left: 16px;
    padding: 8px 16px;
    border: none;
    outline; none;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      color: #555;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;
