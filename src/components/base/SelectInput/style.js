// @flow
import { css } from 'react-emotion';

export const ResetNativeStyle = css`
  position: relative;
  ul {
    list-style-type: none;
    position: fixed;
    margin: 0;
    padding: 0;
    margin-top: 4px;
    overflow: hidden;
    width: 100%;
    z-index: 1;
    li {
      min-width: min-content;
      width: 100%;
    }
  }
`;

export default ResetNativeStyle;
