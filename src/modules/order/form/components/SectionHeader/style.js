import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
  height: 40px;
  align-items: center;
`;

export const TitleWrapperStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  color: ${colors.GRAY};
  ${fontSizes.HUGE};
`;

export const TitleStyle = css`
  letter-spacing: 2px;
`;

export const IconStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
