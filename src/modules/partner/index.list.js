// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Layout } from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import useFilter from 'hooks/useFilter';
import PartnerList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: Object,
  sort: {
    field: string,
    direction: string,
  },
  page: number,
  perPage: number,
};

const getInitFilter = (): State => {
  const state: State = {
    viewType: 'grid',
    filter: {},
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };
  return state;
};

const PartnerModule = (props: Props) => {
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterPartner'
  );
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.code), value: 'code' },
  ];

  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="PARTNER"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
            </NavBar>
          }
        >
          <PartnerList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(PartnerModule);
