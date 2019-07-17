// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import FilterToolBar from 'components/common/FilterToolBar';
import { ExportButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import Portal from 'components/Portal';
import ContainerList from './list';
import { containersExportQuery } from './query';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const getInitFilter = () => {
  const state = {
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
  return state;
};

function OrderModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.warehouseName), value: 'warehouseName' },
    {
      title: intl.formatMessage(messages.warehouseArrivalActualDate),
      value: 'warehouseArrivalActualDate',
    },
    {
      title: intl.formatMessage(messages.warehouseArrivalAgreedDate),
      value: 'warehouseArrivalAgreedDate',
    },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterContainer'
  );
  return (
    <>
      <Portal>
        <FilterToolBar
          icon="CONTAINER"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
        />
        <ExportButton
          type="Containers"
          exportQuery={containersExportQuery}
          variables={{
            filterBy: filterAndSort.filter,
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
          }}
        />
      </Portal>
      <ContainerList {...queryVariables} />
    </>
  );
}

export default injectIntl(OrderModule);
