// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import Layout from 'components/Layout';
import { getByPathWithDefault } from 'utils/fp';
import OrderGridView from './components/OrderGridView';
import query from './query.graphql';

type Props = {};

class OrderList extends React.Component<Props> {
  static defaultProps: Props;

  wrapper: ?HTMLDivElement;

  render() {
    return (
      <div
        ref={ref => {
          this.wrapper = ref;
        }}
      >
        <Layout navBar={<h1> Order Module </h1>}>
          <Query query={query} variables={{ page: 1, perPage: 10 }}>
            {({ loading, error, data }) => {
              if (loading) return `Loading...`;
              if (error) return `Error! ${error.message}`;

              return (
                <OrderGridView items={getByPathWithDefault([], 'viewer.orders.nodes', data)} />
              );
            }}
          </Query>
        </Layout>
      </div>
    );
  }
}

export default OrderList;
