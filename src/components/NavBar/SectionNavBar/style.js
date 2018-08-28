// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';
import { NavBarStyle, ChildrenWrapperStyle } from 'components/NavBar/style';

export const SectionNavBarStyle = css`
  ${NavBarStyle};
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0 10px;
`;

export const SectionNavBarChildrenWrapperStyle = css`
  ${ChildrenWrapperStyle};
`;
