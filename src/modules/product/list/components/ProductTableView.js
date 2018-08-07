// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import { injectIntl, intlShape } from 'react-intl';
import TableView from 'components/TableView';
import messages from '../../messages';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
  intl: intlShape,
};

function ProductTableView({ items, onLoadMore, hasMore, isLoading, intl }: Props) {
  const tableData = items.map(({ name, serial, exporterSuppliers, ...rest }) => ({
    name,
    serial,
    exporter: exporterSuppliers[exporterSuppliers.length - 1].name,
    updatedAt: rest.updatedAt,
    createdAt: rest.createdAt,
    total: items.length,
  }));
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <TableView
          rowHeight={170}
          headerHeight={20}
          height={window.innerHeight - 50}
          width={width}
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={tableData}
          rowGetter={({ index }) => tableData[index] || {}}
          columns={[
            {
              label: intl.formatMessage(messages.name),
              dataKey: 'name',
              width: 100,
            },
            {
              label: intl.formatMessage(messages.serial),
              dataKey: 'serial',
              width: 100,
            },
            {
              label: intl.formatMessage(messages.exporter),
              dataKey: 'exporter',
              width: 200,
            },
            {
              label: intl.formatMessage(messages.updatedAt),
              dataKey: 'updatedAt',
              width: 200,
            },
            {
              label: intl.formatMessage(messages.createdAt),
              dataKey: 'createdAt',
              width: 200,
            },
          ]}
        />
      )}
    </AutoSizer>
  );
}

export default injectIntl(ProductTableView);
