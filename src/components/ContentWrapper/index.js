// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { ContentWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  className: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  width: '100%',
  className: '',
};

const ContentWrapper = ({ className, children, width }: Props) => (
  <div id="mainContent" className={cx(ContentWrapperStyle(width), className)}>
    {children}
  </div>
);

ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
