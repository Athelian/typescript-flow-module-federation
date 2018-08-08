// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizesWithHeights } from 'styles/common';

export const TimelineItemWrapperStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 85px;
`;

export const HeaderStyle = (align: 'left' | 'right') => css`
  ${fontSizesWithHeights.SMALL};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  text-align: ${align};
  padding: 0 3px;
`;

export const IconWrapperStyle = css`
  position: relative;
  display: flex;
  align-items: center;
`;
