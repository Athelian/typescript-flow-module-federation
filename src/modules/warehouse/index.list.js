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
  filter: {},
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
    filter: {},
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
    const fields = [
      { title: 'UPDATED AT', value: 'updatedAt' },
      { title: 'CREATED AT', value: 'createdAt' },
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
            <WarehouseList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(WarehouseModule);
