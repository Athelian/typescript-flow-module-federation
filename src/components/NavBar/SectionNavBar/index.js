// @flow
import * as React from 'react';
import { SectionNavBarStyle, SectionNavBarChildrenWrapperStyle } from './style';

type OptionalProps = {
  upsideDown: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  upsideDown: false,
};

const SectionNavBar = ({ children, upsideDown }: Props) => (
  <div className={SectionNavBarStyle(upsideDown)}>
    <div className={SectionNavBarChildrenWrapperStyle}>{children}</div>
  </div>
);

SectionNavBar.defaultProps = defaultProps;

export default SectionNavBar;
