// @flow

import * as React from 'react';
import { Facebook } from 'react-content-loader';
import BasePlaceHolder from '../BasePlaceHolder';

type Props = {
  children: React.Node,
  id: string,
};

export default function MainSectionPlaceholder({ children, id }: Props) {
  return (
    <BasePlaceHolder id={id} PlaceHolderComponent={Facebook}>
      {children}
    </BasePlaceHolder>
  );
}
