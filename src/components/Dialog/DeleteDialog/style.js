// @flow
import { css } from 'react-emotion';

export const DialogStyle: string = css`
  padding: 24px;
`;

export const RemoveMessageStyle: string = css`
  font-weight: bold;
  font-size: 14px;
  color: #555;
  margin: 24px 0;
  text-align: center;
`;

export const ButtonsStyle: string = css`
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
