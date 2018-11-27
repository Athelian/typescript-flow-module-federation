// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const SectionHeaderStyle: string = css`
  display: grid;
  grid-template-columns: 35px 1fr;
  align-items: center;
  background-color: ${colors.GRAY_VERY_LIGHT};
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const SectionHeaderIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 35px;
  padding: 0 0 0 5px;
  flex-shrink: 0;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_DARK};
`;
