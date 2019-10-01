// @flow
import * as React from 'react';
import { CellWrapperStyle } from './style';

type Props = {|
  isExpandedHeading?: boolean,
  children: React.Node,
|};

const CellWrapper = React.forwardRef<Props, HTMLElement>(
  ({ isExpandedHeading, children, ...rest }: Props, ref) => {
    return (
      <div ref={ref} className={CellWrapperStyle(Boolean(isExpandedHeading))} {...rest}>
        {children}
      </div>
    );
  }
);

export default CellWrapper;
