// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const WrapperStyle = css`
  display: grid;
  width: 100%;
  ${scrollbars.MAIN};
  grid-template-columns: repeat(15, min-content);
  grid-template-rows: auto;
`;

export const ContentStyle = css`
  margin: 10px 0;
  min-width: 10px;
`;

export const HeadingStyle = css`
  padding: 20px;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const ScrollWrapperStyle = css`
  ${scrollbars.MAIN};
  width: 100%;
  overflow: auto;
  flex: 1;
`;
