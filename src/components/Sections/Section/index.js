// @flow
import * as React from 'react';
import { SectionWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const Section = ({ children }: Props) => <div className={SectionWrapperStyle}>{children}</div>;

export default Section;
