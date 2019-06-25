// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  ${fontSizes.SMALL};
  width: 100%;
  grid-gap: 10px;
  grid-template-columns: 120px 30px;
`;

export const TitleStyle = (iconColor: string): string => css`
  text-transform: uppercase;
  & svg {
    color: ${colors[iconColor]};
    margin-right: 5px;
  }
`;
