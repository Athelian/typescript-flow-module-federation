// @flow
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import PageNotFound from 'components/PageNotFound';
import { decodeId } from 'utils/id';

export default function withNotFound(WrappedComponent: React.ComponentType<any>, id: string) {
  return function NotFoundWrappedComponent(props: any) {
    if (parseInt(decodeId(props[id]), 10) > 0 || props.path === 'new')
      return <WrappedComponent {...props} />;
    return <PageNotFound />;
  };
}
