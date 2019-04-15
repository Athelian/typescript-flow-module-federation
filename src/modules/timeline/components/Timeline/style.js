// @flow
import { css } from 'react-emotion';
import { colors, scrollbars, layout } from 'styles/common';

export const TimelineWrapperStyle = css`
  ${layout.VERTICAL};
  background-color: ${colors.WHITE};
  height: 100%;
  width: 100%;
`;

export const ListWrapperStyle = css`
  ${scrollbars.MAIN};
  ${layout.VERTICAL};
  ${layout.CENTER};
  overflow-x: hidden;
  overflow-y: overlay;
  width: 100%;
  flex: 1;
`;

export const CommentInputWrapperStyle = css`
  padding: 0 100px;
`;
