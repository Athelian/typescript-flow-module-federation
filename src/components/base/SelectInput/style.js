import { css } from 'react-emotion';

export const ResetNativeStyle = css`
  ul {
    list-style-type: none;
    position: fixed;
    padding: 0;
    overflow: hidden;
    li {
      min-width: min-content;
      width: 100%;
    }
  }
`;

export default ResetNativeStyle;
