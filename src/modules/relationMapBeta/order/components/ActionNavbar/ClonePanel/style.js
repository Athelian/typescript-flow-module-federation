import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const ContainerWrapper = css`
  height: 50px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: ${colors.TEAL_LIGHT};
`;

export const Header = css`
  display: flex;
  align-items: center;
  color: ${colors.TEAL_DARK};
`;
