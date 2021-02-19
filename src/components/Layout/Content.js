// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { ContentWrapperStyle, SubNavBarContentWrapperStyle } from './style';

type Props = {
  children: React.Node,
  notCenter?: boolean,
  hasSubNavBar?: boolean,
};

const defaultProps = {
  notCenter: false,
  hasSubNavBar: false,
};

const Content = ({ notCenter, hasSubNavBar = false, children }: Props) => (
  <div
    className={cx(ContentWrapperStyle(notCenter), { [SubNavBarContentWrapperStyle]: hasSubNavBar })}
  >
    {children}
  </div>
);

Content.defaultProps = defaultProps;

export default Content;
