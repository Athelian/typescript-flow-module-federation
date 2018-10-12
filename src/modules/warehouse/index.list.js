// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import WarehouseList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
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
    const { intl } = this.props;

    const sortFields = [
      { title: intl.formatMessage(messages.createdAt), value: 'updatedAt' },
      { title: intl.formatMessage(messages.updatedAt), value: 'createdAt' },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <FilterToolBar
                  icon="WAREHOUSE"
                  sortFields={sortFields}
                  filtersAndSort={this.state}
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
