// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { QueryRenderPropFunction } from 'react-apollo';
import query from './query';

type Props = {|
  filterBy: {
    query?: string,
    types?: Array<string>,
  },
  sortBy: {
    createdAt?: string,
    updatedAt?: string,
  },
  perPage: number,
  page: number,
  children: QueryRenderPropFunction<any, any>,
|};

const PartnerList = ({ filterBy, sortBy, page, perPage, children }: Props) => (
  <Query fetchPolicy="network-only" query={query} variables={{ page, perPage, filterBy, sortBy }}>
    {children}
  </Query>
);

export default PartnerList;
