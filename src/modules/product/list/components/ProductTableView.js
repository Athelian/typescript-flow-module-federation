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

function ProductTableView({ items, onLoadMore, hasMore, isLoading }: Props) {
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
              label: 'NAME',
              dataKey: 'name',
              width: 100,
            },
            {
              label: 'Serial',
              dataKey: 'serial',
              width: 100,
            },
            {
              label: 'Exporter',
              dataKey: 'exporter',
              width: 200,
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

export default ProductTableView;
