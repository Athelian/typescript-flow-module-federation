// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import BatchList from './list';
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

class BatchListModule extends React.Component<Props, State> {
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
    const { viewType, sort, perPage, filter } = this.state;
    const { intl } = this.props;

    const fields = [
      { title: intl.formatMessage(messages.batchNo), value: 'no' },
      { title: intl.formatMessage(messages.PO), value: 'PO' },
      {
        title: intl.formatMessage(messages.productName),
        value: 'product',
      },
      {
        title: intl.formatMessage(messages.deliveredAt),
        value: 'deliveredAt',
      },
      {
        title: intl.formatMessage(messages.expiredAt),
        value: 'expiredAt',
      },
      {
        title: intl.formatMessage(messages.producedAt),
        value: 'producedAt',
      },
      {
        title: intl.formatMessage(messages.updatedAt),
        value: 'updatedAt',
      },
      {
        title: intl.formatMessage(messages.createdAt),
        value: 'createdAt',
      },
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
                  icon="ORDER"
                  fields={fields}
                  onChange={this.onChangeFilter}
                />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <BatchList viewType={viewType} sort={sort} perPage={perPage} filter={filter} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(BatchListModule);
