// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import { getByPathWithDefault } from 'utils/fp';

import { ordersInGlobalViewQuery } from './query';

const initialVariables = {
  page: 1,
  perPage: 10,
  sortBy: {},
  filterBy: {},
};

const GlobalView = () => {
  return (
    <>
      <NavBar>Menu</NavBar>
      <Content>
        <Query query={ordersInGlobalViewQuery} variables={initialVariables}>
          {({ error, data }) => {
            if (error) {
              return error.message;
            }

            const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
            const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
            const hasMore = nextPage <= totalPage;

            console.debug(hasMore);

            return <div>hahah</div>;
          }}
        </Query>
      </Content>
    </>
  );
};

export default GlobalView;
