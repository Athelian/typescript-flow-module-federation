// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import ProductList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};

class ProductListModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      query: '',
      archived: false,
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
    const { intl } = this.props;

    const sortFields = [
      { title: intl.formatMessage(messages.name), value: 'name' },
      { title: intl.formatMessage(messages.serial), value: 'serial' },
      { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <FilterToolBar
                  icon="PRODUCT"
                  sortFields={sortFields}
                  filtersAndSort={this.state}
                  onChange={this.onChangeFilter}
                />
                <Link to="new">
                  <NewButton data-testid="newButton" />
                </Link>
                <ExportButton type="data" format="csv" template="Product" />
              </NavBar>
            }
          >
            <ProductList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ProductListModule);
