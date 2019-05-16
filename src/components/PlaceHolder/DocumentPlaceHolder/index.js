// @flow

import * as React from 'react';
import { Code } from 'react-content-loader';
import BasePlaceHolder from '../BasePlaceHolder';

type OptionalProps = {
  width: number,
  height: number,
  isLoading: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
  id: string,
};

const defaultProps = {
  width: 880,
  height: 320,
  isLoading: false,
};

export default function DocumentPlaceHolder({ children, ...rest }: Props) {
  return (
    <BasePlaceHolder {...rest} PlaceHolderComponent={Code}>
      {children}
    </BasePlaceHolder>
  );
}

DocumentPlaceHolder.defaultProps = defaultProps;
