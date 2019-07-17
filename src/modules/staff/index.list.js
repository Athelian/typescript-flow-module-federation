// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import FilterToolBar from 'components/common/FilterToolBar';
import { Content } from 'components/Layout';
import Portal from 'components/Portal';
import useFilter from 'hooks/useFilter';
import StaffList from './list';
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
  perPage: number,
  page: number,
};

const getInitFilter = (): State => ({
  viewType: 'grid',
  filter: {},
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
});

const StaffModule = (props: Props) => {
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterStaff'
  );
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.firstName), value: 'firstName' },
    { title: intl.formatMessage(messages.lastName), value: 'lastName' },
    { title: intl.formatMessage(messages.fullName), value: 'fullName' },
  ];
  return (
    <Content>
      <Portal>
        <FilterToolBar
          icon="STAFF"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
        />
      </Portal>
      <StaffList {...queryVariables} />
    </Content>
  );
};

export default injectIntl(StaffModule);
