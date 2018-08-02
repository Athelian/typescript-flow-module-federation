// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import EntityIcon from 'components/NavBar/components/EntityIcon';
import ViewToggle from 'components/NavBar/components/ViewToggle';
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
              <NavBar>
                <EntityIcon icon="fasShip" color="RED" />
                <ViewToggle changeToggle={this.onToggleView} isTableView={viewType === 'list'} />
              </NavBar>
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
