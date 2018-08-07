// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizesWithHeights } from 'styles/common';

export const TimelineTransitItemWrapperStyle = css`
  display: flex;
  flex-direction: column;
  flex: 2;
  min-width: 170px;
`;

export const HeaderStyle = css`
  ${fontSizesWithHeights.SMALL};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  text-align: center;
  padding: 0 3px;
`;

export const IconWrapperStyle = css`
  position: relative;
  display: flex;
  align-items: center;
`;

export const DatesWrapperStyle = css`
  display: flex;
  justify-content: center;
`;
