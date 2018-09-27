// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import FilterToolBar from 'components/common/FilterToolBar';
import Layout from 'components/Layout';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import ShipmentList from './list';
import messages from './messages';

type Props = {
  intl: intlShape,
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
    const { viewType, sort, perPage, filter } = this.state;
    const { intl } = this.props;

    const fields = [
      { title: intl.formatMessage(messages.estimatedDeparture), value: 'ETD' },
      { title: intl.formatMessage(messages.estimatedArrival), value: 'ETA' },
      { title: intl.formatMessage(messages.warehouseArrival), value: 'warehouseArrival' },
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
                  filtersAndSort={this.state}
                  icon="SHIPMENT"
                  onChange={this.onChangeFilter}
                  fields={fields}
                />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <ShipmentList viewType={viewType} sort={sort} perPage={perPage} filter={filter} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ShipmentListModule);
