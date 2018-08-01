// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import OrderList from './list';

type Props = {};

type State = {
  viewType: string,
};

class Order extends React.Component<Props, State> {
  state = { viewType: 'list' };

  onToggleView = () => {
    this.setState(prevState => ({ viewType: prevState.viewType === 'list' ? 'grid' : 'list' }));
  };

  render() {
    const { viewType } = this.state;
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <div>
                <h1> Navbar </h1>
                <button style={{ cursor: 'pointer' }} type="button" onClick={this.onToggleView}>
                  View Mode:
                  {viewType}. Click here to change.
                </button>
              </div>
            }
          >
            <OrderList viewType={viewType} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default Order;
