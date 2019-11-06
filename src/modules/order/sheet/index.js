// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, OrderFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig, useSheet } from 'components/Sheet';
import { clone } from 'utils/fp';
import { ordersExportQuery } from '../query';
import orderColumns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import { ordersQuery } from './query';

type Props = {
  orderIds?: Array<string>,
};

const OrderSheetModule = ({ orderIds }: Props) => {
  const client = useApolloClient();
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(data => decorate(clone(data?.orders?.nodes ?? [])), []);

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
    columns: orderColumns,
    itemsQuery: ordersQuery,
    initialFilterBy: orderIds ? { query: '', ids: orderIds } : { query: '', archived: false },
    initialSortBy: { updatedAt: 'DESCENDING' },
    sorter,
    getItems,
    cacheKey: 'order_sheet',
  });

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="ORDER" color="ORDER" subIcon="TABLE" />

        <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig
          config={orderColumns}
          columns={columns}
          onChange={setColumns}
          templateType="OrderSheet"
        />
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
        columns={columns}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLocalSort={onLocalSort}
        onRemoteSort={onRemoteSort}
        onLoadMore={onLoadMore}
      />
    </Content>
  );
};

export default OrderSheetModule;
