// @flow
import { css } from 'react-emotion';

export const SectionWrapperStyle = (display: Boolean) => css`
  width: 100%;
  display: flex;
  ${!display &&
    `
    height: 0;
    overflow: hidden;
  `};
  flex-direction: column;
  align-items: center;
`;

export default SectionWrapperStyle;
