// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import OrderGridView from './components/OrderGridView';
import OrderListView from './components/OrderListView';
import query from './query.graphql';

type Props = {
  viewType: string,
};

class OrderList extends React.PureComponent<Props> {
  render() {
    const { viewType } = this.props;
    return (
      <Query query={query} variables={{ page: 1, perPage: 10 }}>
        {({ loading, error, data }) => {
          if (loading) return `Loading...`;
          if (error) return `Error! ${error.message}`;
          if (viewType === 'list')
            return <OrderListView items={getByPathWithDefault([], 'viewer.orders.nodes', data)} />;
          return <OrderGridView items={getByPathWithDefault([], 'viewer.orders.nodes', data)} />;
        }}
      </Query>
    );
  }
}

export default OrderList;
