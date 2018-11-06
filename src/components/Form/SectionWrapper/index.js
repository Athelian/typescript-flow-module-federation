// @flow
import * as React from 'react';
import { SectionWrapperStyle } from './style';

type OptionalProps = {
  display: Boolean,
  key: string,
};

type Props = OptionalProps & {
  id: string,
  children: React.Node,
};

const SectionWrapper = ({ children, id, display, key }: Props) => (
  <div className={SectionWrapperStyle(display)} id={id} key={key}>
    {children}
  </div>
);

SectionWrapper.defaultProps = {
  display: true,
  key: '',
};

export default SectionWrapper;
