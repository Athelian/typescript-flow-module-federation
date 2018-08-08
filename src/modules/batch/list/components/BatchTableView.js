// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import TableView from 'components/TableView';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

function BatchTableView({ items, onLoadMore, hasMore, isLoading }: Props) {
  const tableData = items.map(({ id, no, orderItem, quantity, ...rest }) => ({
    id,
    no,
    name: orderItem.productExporterSupplier.product.name,
    quantity,
    deliveredAt: rest.deliveredAt,
    exporter: orderItem.order.exporter.name,
    updatedAt: rest.updatedAt,
    createdAt: rest.createdAt,
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
              label: 'BATCH ID',
              dataKey: 'id',
              width: 100,
            },
            {
              label: 'PO NO.',
              dataKey: 'no',
              width: 100,
            },
            {
              label: 'PRODUCT NAME',
              dataKey: 'name',
              width: 100,
            },
            {
              label: 'QUANTITY',
              dataKey: 'quantity',
              width: 100,
            },
            {
              label: 'EXPORTER',
              dataKey: 'exporter',
              width: 200,
            },
            {
              label: 'DELIVERY DATE',
              dataKey: 'deliveredAt',
              width: 100,
            },
            {
              label: 'Last Modified',
              dataKey: 'updatedAt',
              width: 200,
            },
            {
              label: 'Created On',
              dataKey: 'createdAt',
              width: 200,
            },
          ]}
        />
      )}
    </AutoSizer>
  );
}

export default BatchTableView;
