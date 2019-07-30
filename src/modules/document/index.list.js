// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import DocumentList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

function DocumentModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.type), value: 'type' },
    { title: intl.formatMessage(messages.status), value: 'status' },
    { title: intl.formatMessage(messages.size), value: 'size' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
      filter: {
        query: '',
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    'filterDocument'
  );

  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="DOCUMENT"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canSearch
        />
      </NavBar>
      <DocumentList {...queryVariables} />
    </Content>
  );
}

export default injectIntl(DocumentModule);
