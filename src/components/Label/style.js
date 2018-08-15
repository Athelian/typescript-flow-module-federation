// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets } from 'styles/common';

export const LabelWrapperStyle = (horizontal: boolean) => css`
  position: relative;
  display: flex;
  flex-direction: ${horizontal ? 'row' : 'column'};
  ${horizontal && 'justify-content: space-between'};
  flex: 1;
  min-height: min-content;
  max-height: min-content;
  width: 100%;
`;

export const LabelStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY};
  letter-spacing: 2px;
  user-select: none;
  margin-right: 15px;
`;
