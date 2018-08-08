import { css } from 'react-emotion';
import { fontSizesWithHeights } from 'styles/common';

const marginSize = 8;

export const DividerLineStyle = css`
  border-bottom: 1px solid #fff;
  margin-top: ${marginSize}px;
  margin-bottom: ${marginSize}px;
`;

export const ChangeValueStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const ChangesSpanStyle = css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
`;
