// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const SectionNavigationWrapper = (isActive: boolean) => css`
  min-width: 100px;
  text-align: center;
  cursor: pointer;
  background: #fff;
  border: 0;
  ${isActive &&
    `
    border-bottom: 5px solid ${colors.BLUE_DARK};
  `};
`;

export default SectionNavigationWrapper;
