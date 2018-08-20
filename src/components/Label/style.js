// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights } from 'styles/common';

export const LabelWrapperStyle = (horizontal: boolean) => css`
  position: relative;
  display: flex;
  ${horizontal && 'align-items: center'};
  flex-direction: ${horizontal ? 'row' : 'column'};
  ${horizontal && 'justify-content: space-between'};
  flex: 1;
  min-height: min-content;
  max-height: min-content;
  width: 100%;
`;

export const LabelStyle = css`
  ${fontSizesWithHeights.SMALL};
  white-space: nowrap;
  color: ${colors.GRAY};
  letter-spacing: 2px;
  user-select: none;
  margin-right: 15px;
  display: flex;
`;

export const TooltipStyle = css`
  position: absolute;
  left: -5px;
`;
