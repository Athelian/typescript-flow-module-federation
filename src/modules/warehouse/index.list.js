// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, StatusToggleTabs } from 'components/NavBar';
import WarehouseList from './list';

type Props = {
  intl: intlShape,
};

type State = {
  viewType: string,
  query: string,
  status: string,
  perPage: number,
};

class WarehouseModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    query: '',
    status: 'Active',
    perPage: 10,
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { viewType, perPage, query, ...filters } = this.state;

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />
                <StatusToggleTabs
                  onChange={index => this.onChangeFilter({ status: index ? 'Inactive' : 'Active' })}
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

export default injectIntl(WarehouseModule);
