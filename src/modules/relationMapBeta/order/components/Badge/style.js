import { css } from 'react-emotion';
import { colors, fontSizes, borderRadiuses } from 'styles/common';

export const ContainerWrapper = css`
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 1;

  padding: 1px 2px;
  ${borderRadiuses.MAIN};

  background-color: ${colors.TEAL_VERY_DARK};
  color: ${colors.WHITE};

  ${fontSizes.LITTLE};
`;

export default ContainerWrapper;
