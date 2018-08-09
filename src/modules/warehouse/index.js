// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, ActiveToggleTabs } from 'components/NavBar';
import WarehouseList from './list';

type Props = {};
type State = {
  viewType: string,
  status: string,
  perPage: number,
};

// TODO: We will restructure when we're working on new form system
class WarehouseModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    status: 'Active',
    perPage: 10,
  };

  onChangeFilter = (field: string, newValue: any) => {
    this.setState(prevState => ({ ...prevState, [field]: newValue }));
  };

  render() {
    const { viewType, perPage, ...filters } = this.state;
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="faWarehouse" color="WAREHOUSE_MUD" />
                <ActiveToggleTabs
                  onChange={index => this.onChangeFilter('status', index ? 'Inactive' : 'Active')}
                />
              </NavBar>
            }
          >
            <WarehouseList viewType={viewType} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default WarehouseModule;
