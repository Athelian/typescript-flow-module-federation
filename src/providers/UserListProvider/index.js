// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { QueryRenderPropFunction } from 'react-apollo';
import query from './query';

type OptionalProps = {
  queryVariables: Object,
};

type Props = OptionalProps & {
  children: QueryRenderPropFunction<any, any>,
};

const defaultProps = {
  queryVariables: {
    filterBy: {},
    sortBy: {},
    page: 1,
    perPage: 100,
  },
};

const UserListProvider = ({ queryVariables, children }: Props) => (
  <Query fetchPolicy="network-only" query={query} variables={queryVariables}>
    {children}
  </Query>
);

UserListProvider.defaultProps = defaultProps;

export default UserListProvider;
