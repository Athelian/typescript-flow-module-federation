import { css } from 'react-emotion';

export const ResetNativeStyle = css`
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 4px;
    overflow: hidden;
    width: 100%;
    li {
      min-width: min-content;
      width: 100%;
    }
  }
`;

export default ResetNativeStyle;
