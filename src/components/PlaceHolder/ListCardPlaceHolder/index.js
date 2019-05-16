// @flow

import * as React from 'react';
import { List } from 'react-content-loader';
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

export default function ListCardPlaceHolder({ children, ...rest }: Props) {
  return (
    <BasePlaceHolder {...rest} PlaceHolderComponent={List}>
      {children}
    </BasePlaceHolder>
  );
}

ListCardPlaceHolder.defaultProps = defaultProps;
