// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ArchivedStyle = css`
  display: flex;
  color: ${colors.GRAY_DARK};
`;

export const ActiveStyle = css`
  display: flex;
  color: ${colors.TEAL};
`;

export const InfoIconStyle: string = css`
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
`;
