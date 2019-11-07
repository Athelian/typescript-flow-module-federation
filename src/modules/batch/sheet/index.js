// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, BatchFilterConfig } from 'components/NavBar';
import { Sheet, ColumnsConfig, useSheet } from 'components/Sheet';
import { clone } from 'utils/fp';
import batchColumns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import { batchesQuery } from './query';

type Props = {
  batchIds?: Array<string>,
};

const BatchSheetModule = ({ batchIds }: Props) => {
  const client = useApolloClient();
  const memorizedMutate = React.useCallback(mutate(client), [client]);
  const memorizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(data => decorate(clone(data?.batches?.nodes ?? [])), []);

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
    onLocalSort,
    onRemoteSort,
  } = useSheet({
    columns: batchColumns,
    itemsQuery: batchesQuery,
    initialFilterBy: batchIds ? { query: '', ids: batchIds } : { query: '', archived: false },
    initialSortBy: { updatedAt: 'DESCENDING' },
    sorter,
    getItems,
    cacheKey: 'batch_sheet',
  });

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="BATCH" color="BATCH" subIcon="TABLE" />

        <Filter config={BatchFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig
          config={batchColumns}
          columns={columns}
          onChange={setColumns}
          templateType="BatchSheet"
        />
      </NavBar>

      <Sheet
        columns={columns}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memorizedMutate}
        handleEntityEvent={memorizedHandler}
        onLocalSort={onLocalSort}
        onRemoteSort={onRemoteSort}
        onLoadMore={onLoadMore}
      />
    </Content>
  );
};

export default BatchSheetModule;
