// @flow
import * as React from 'react';
import { ContentWrapperStyle } from './style';

type OptionalProps = {
  notCenter: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  notCenter: false,
};

const Content = ({ notCenter, children }: Props) => {
  return <div className={ContentWrapperStyle({ notCenter })}>{children}</div>;
};

Content.defaultProps = defaultProps;

export default Content;
