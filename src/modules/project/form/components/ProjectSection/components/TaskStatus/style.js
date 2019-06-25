// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  ${fontSizes.SMALL};
  width: 245px;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
`;

export const TitleStyle = (iconColor: string): string => css`
  text-transform: uppercase;
  & svg {
    color: ${colors[iconColor]};
    margin-right: 5px;
  }
`;
