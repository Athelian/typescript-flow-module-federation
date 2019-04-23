// @flow
import { css } from 'react-emotion';
import { layout, presets, fontSizes, colors } from 'styles/common';

export const OrderFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const ItemsUIWrapperStyle: string = css`
  display: flex;
`;

type ItemsUIProps = {
  isActive: boolean,
  flipped: boolean,
};

export const ItemsUIStyle = ({ isActive, flipped }: ItemsUIProps): string => css`
  ${presets.BUTTON};
  ${fontSizes.HUGE};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${flipped && 'transform: scaleX(-1)'};
  ${isActive
    ? `
    color: ${colors.TEAL};
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover, :focus {
      color: ${colors.GRAY};
    }
  `};
`;
