// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useApolloClient } from '@apollo/react-hooks';
import { equals } from 'ramda';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, OrderFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig, useSheet, useResizedColumns } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import LoadingIcon from 'components/LoadingIcon';
import type { ColumnConfig } from 'components/Sheet';
import useFieldDefinitions from 'hooks/useFieldDefinitions';
import { clone } from 'utils/fp';
import { ordersExportQuery } from '../query';
import orderColumns, { FieldDefinitionEntityTypes, OrderSheetColumnGroups } from './columns';
import orderTransformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import actions from './actions';
import { ordersQuery } from './query';

type Props = {
  orderIds?: Array<string>,
};

type ImplProps = {
  ...Props,
  columns: Array<ColumnConfig>,
  transformer: Object => Array<Array<CellValue>>,
};

const OrderSheetModuleImpl = ({ orderIds, columns: columnConfigs, transformer }: ImplProps) => {
  const client = useApolloClient();
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(
    data => ({ ...data?.orders, nodes: decorate(clone(data?.orders?.nodes ?? [])) }),
    []
  );
  const orderIdsRef = React.useRef<?Array<string>>(null);

  const {
    initialItems,
    loading,
    hasMore,
    onLoadMore,
    columns,
    setColumns,
    query,
    setQuery,
    filterBy,
    setFilterBy,
    sortBy,
    localSortBy,
    onLocalSort,
    onRemoteSort,
  } = useSheet({
    columns: columnConfigs,
    itemsQuery: ordersQuery,
    initialFilterBy: { query: '', archived: false },
    initialSortBy: { updatedAt: 'DESCENDING' },
    sorter,
    getItems,
    cacheKey: 'order_sheet',
  });

  const [resizedColumns, onColumnResize] = useResizedColumns(columns, 'order_sheet');

  if (!!orderIds && !equals(orderIdsRef.current, orderIds)) {
    setFilterBy({ query: '', ids: orderIds });
    orderIdsRef.current = orderIds;
  }

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="ORDER" color="ORDER" subIcon="TABLE" />

        <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig columns={columns} templateType="OrderSheet" onChange={setColumns}>
          {({ getGroupProps }) =>
            OrderSheetColumnGroups.map(type => (
              <ColumnsConfig.Group {...getGroupProps(type)} key={type} />
            ))
          }
        </ColumnsConfig>
        <ExportButton
          type="Orders"
          exportQuery={ordersExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
            localSortBy,
            columns: columns.filter(c => !!c.exportKey).map(c => c.exportKey),
          }}
        />
      </NavBar>

      <Sheet
        columns={resizedColumns}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLocalSort={onLocalSort}
        onRemoteSort={onRemoteSort}
        onLoadMore={onLoadMore}
        onColumnResize={onColumnResize}
        actions={actions}
      />
    </Content>
  );
};

const OrderSheetModule = ({ orderIds }: Props) => {
  const intl = useIntl();
  const { fieldDefinitions, loading } = useFieldDefinitions(FieldDefinitionEntityTypes);

  if (loading) {
    return <LoadingIcon />;
  }

  const allFieldDefinitions = {
    orderFieldDefinitions: fieldDefinitions?.Order ?? [],
    productFieldDefinitions: fieldDefinitions?.Product ?? [],
    orderItemFieldDefinitions: fieldDefinitions?.OrderItem ?? [],
    batchFieldDefinitions: fieldDefinitions?.Batch ?? [],
    shipmentFieldDefinitions: fieldDefinitions?.Shipment ?? [],
  };

  return (
    <OrderSheetModuleImpl
      columns={orderColumns(allFieldDefinitions)}
      transformer={orderTransformer({ ...allFieldDefinitions, intl })}
      orderIds={orderIds}
    />
  );
};

export default OrderSheetModule;
