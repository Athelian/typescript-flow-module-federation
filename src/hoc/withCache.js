// @flow
import * as React from 'react';
import { isEquals, pickByProps } from 'utils/fp';

export default function withCache(
  WrappedComponent: React.ComponentType<any>,
  cachedProps: string[]
) {
  return class CacheWrappedComponent extends React.Component<any> {
    shouldComponentUpdate(nextProps: Object) {
      const { cachedFields = [] } = this.props;
      const caches = [...cachedProps, ...cachedFields];
      const nextPropsValues = pickByProps(caches, this.props);
      const currentPropsValues = pickByProps(caches, nextProps);
      if (isEquals(nextPropsValues, currentPropsValues)) {
        return false;
      }
      return true;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
