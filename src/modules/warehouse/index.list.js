// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import WarehouseList from './list';

type Props = {
  intl: intlShape,
};

type State = {
  viewType: string,
  filter: {
    query: string,
    status: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};
class WarehouseModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      query: '',
      status: 'Active',
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { viewType, sort, perPage, filter } = this.state;

    const fields = [
      { title: 'updatedAt', value: 'updatedAt' },
      { title: 'createdAt', value: 'createdAt' },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <FilterToolBar
                  filtersAndSort={this.state}
                  icon="WAREHOUSE"
                  fields={fields}
                  onChange={this.onChangeFilter}
                />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <WarehouseList viewType={viewType} sort={sort} perPage={perPage} filter={filter} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(WarehouseModule);
