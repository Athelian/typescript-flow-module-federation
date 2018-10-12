// @flow
import * as React from 'react';
import { SectionWrapperStyle } from './style';

type Props = {
  id: string,
  children: React.Node,
};

const SectionWrapper = ({ children, id }: Props) => (
  <div className={SectionWrapperStyle} id={id}>
    {children}
  </div>
);

export default SectionWrapper;
