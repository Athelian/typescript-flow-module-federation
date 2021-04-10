// @flow
import { css } from 'react-emotion';

export const SectionWrapperStyle = (display: Boolean) => css`
  width: 100%;
  max-width: calc(100vw - 220px);
  display: flex;
  ${!display &&
    `
    height: 0;
    overflow: hidden;
  `};
  flex-direction: column;
  align-items: center;
  &#order_documentsSection {
    > div {
      width: 100%;
    }
  }
`;

export default SectionWrapperStyle;
