// @flow
import * as React from 'react';
import { ContentWrapperStyle } from './style';

type Props = {
  children: React.Node,
  notCenter?: boolean,
};

const defaultProps = {
  notCenter: false,
};

const Content = ({ notCenter, children }: Props) => (
  <div className={ContentWrapperStyle(notCenter)}>{children}</div>
);

Content.defaultProps = defaultProps;

export default Content;
