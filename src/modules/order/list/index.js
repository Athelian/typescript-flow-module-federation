// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import Layout from 'components/Layout';
import { getByPathWithDefault } from 'utils/fp';
import OrderGridView from './components/OrderGridView';
import query from './query.graphql';
import OrderListView from './components/OrderListView';

type Props = {};

type State = {
  viewType: string,
};

class OrderList extends React.Component<Props, State> {
  static defaultProps: Props;

  state = {
    viewType: 'list',
  };

  onToggleView = () => {
    this.setState(prevState => ({ viewType: prevState.viewType === 'list' ? 'grid' : 'list' }));
  };

  wrapper: ?HTMLDivElement;

  render() {
    const { viewType } = this.state;

    return (
      <div
        ref={ref => {
          this.wrapper = ref;
        }}
      >
        <Layout
          navBar={
            <div>
              <h1> Order Module </h1>
              <button type="button" onClick={this.onToggleView}>
                Toggle View
              </button>
            </div>
          }
        >
          <Query query={query} variables={{ page: 1, perPage: 10 }}>
            {({ loading, error, data }) => {
              if (loading) return `Loading...`;
              if (error) return `Error! ${error.message}`;
              if (viewType === 'list')
                return (
                  <OrderListView items={getByPathWithDefault([], 'viewer.orders.nodes', data)} />
                );
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
