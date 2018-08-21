// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, fontSizes } from 'styles/common';

export const LabelWrapperStyle = (vertical: boolean) => css`
  position: relative;
  display: flex;
  ${!vertical && 'align-items: center; justify-content: space-between'};
  flex-direction: ${vertical ? 'column' : 'row'};
  flex: 1;
  min-height: min-content;
  max-height: min-content;
  width: 100%;
`;

export const LabelStyle = css`
  position: relative;
  ${fontSizesWithHeights.MAIN};
  ${fontSizes.SMALL};
  white-space: nowrap;
  color: ${colors.GRAY};
  letter-spacing: 2px;
  user-select: none;
  display: flex;
  padding: 0 5px;
`;

export const TooltipStyle = css`
  position: absolute;
  left: 0px;
`;
