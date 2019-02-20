import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const ContainerWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  background-color: ${colors.TEAL_LIGHT};
`;

export const LabelStyle = css`
  padding: 3px 0;
`;
