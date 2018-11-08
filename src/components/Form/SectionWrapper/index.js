// @flow
import * as React from 'react';
import { SectionWrapperStyle } from './style';

type OptionalProps = {
  display: Boolean,
};

type Props = OptionalProps & {
  id: string,
  children: React.Node,
};

const SectionWrapper = ({ children, id, display }: Props) => (
  <div className={SectionWrapperStyle(display)} id={id}>
    {children}
  </div>
);

SectionWrapper.defaultProps = {
  display: true,
};

export default SectionWrapper;
