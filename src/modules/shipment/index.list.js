// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import FilterToolBar from 'components/common/FilterToolBar';
import Layout from 'components/Layout';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import ShipmentList from './list';
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

class ShipmentListModule extends React.Component<Props, State> {
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

  onChangeFilter = (newValue: Object) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { intl } = this.props;

    const sortFields = [
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
                  icon="SHIPMENT"
                  sortFields={sortFields}
                  filtersAndSort={this.state}
                  onChange={this.onChangeFilter}
                />
                <Link to="new">
                  <NewButton />
                </Link>
                <ExportButton type="data" format="csv" template="ShipmentOrder" />
              </NavBar>
            }
          >
            <ShipmentList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ShipmentListModule);
