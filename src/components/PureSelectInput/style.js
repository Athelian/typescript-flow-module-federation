import { css } from 'react-emotion';

export const ResetNativeStyle = css`
  ul {
    list-style-type: none;
    position: fixed;
    padding-left: 0;
    li {
      width: min-content;
      min-width: min-content;
    }
  }
`;

export default ResetNativeStyle;
