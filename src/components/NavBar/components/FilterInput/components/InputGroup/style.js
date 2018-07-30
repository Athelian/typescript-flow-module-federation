// @flow
import { css } from 'react-emotion';

export const InputGroupStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
  min-width: min-content;
  padding: 25px 10px;
  width: 100%;
`;

export default InputGroupStyle;
