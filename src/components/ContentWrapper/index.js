// @flow
import * as React from 'react';

import { ContentWrapperStyle } from './style';

type Props = {
  width: string,
  children: React.Node,
};

const ContentWrapper = ({ children, width }: Props) => (
  <div className={ContentWrapperStyle(width)}>{children}</div>
);

export default ContentWrapper;
