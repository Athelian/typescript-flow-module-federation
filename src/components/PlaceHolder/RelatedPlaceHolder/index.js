// @flow

import * as React from 'react';
import { BulletList } from 'react-content-loader';
import BasePlaceHolder from '../BasePlaceHolder';

type OptionalProps = {
  width: number,
  height: number,
};

type Props = OptionalProps & {
  children: React.Node,
  id: string,
};

const defaultProps = {
  width: 880,
  height: 320,
};

export default function RelatedPlaceHolder({ children, ...rest }: Props) {
  return (
    <BasePlaceHolder {...rest} PlaceHolderComponent={BulletList}>
      {children}
    </BasePlaceHolder>
  );
}

RelatedPlaceHolder.defaultProps = defaultProps;
