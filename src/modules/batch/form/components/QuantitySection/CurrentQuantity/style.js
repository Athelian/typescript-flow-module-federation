// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const WrapperStyle: string = css`
  position: absolute;
  top: -5px;
  right: -175px;
  display: flex;
  justify-content: space-around;
  width: 382px;
  padding: 5px 0px;
  border-radius: 7.5px;
  background: ${colors.GRAY_SUPER_LIGHT};
`;

export const QuantityLabelStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 2px;
  text-transform: uppercase;
`;
