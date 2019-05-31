// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { QueryRenderPropFunction } from 'react-apollo';
import query from './query';

type OptionalProps = {
  filterBy: {
    query?: string,
    groupIds?: Array<string>,
  },
  sortBy: {
    createdAt?: string,
    updatedAt?: string,
  },
  perPage: number,
  page: number,
};

type Props = OptionalProps & {
  children: QueryRenderPropFunction<any, any>,
};

const defaultProps = {
  filterBy: {},
  sortBy: {},
  page: 1,
  perPage: 100,
};

const UserList = ({ filterBy, sortBy, page, perPage, children }: Props) => (
  <Query fetchPolicy="network-only" query={query} variables={{ page, perPage, filterBy, sortBy }}>
    {children}
  </Query>
);

UserList.defaultProps = defaultProps;

export default UserList;
