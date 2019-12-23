// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { equals } from 'ramda';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, BatchFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import {
  Sheet,
  ColumnsConfig,
  useSheet,
  useColumnStates,
  useExportedColumns,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import LoadingIcon from 'components/LoadingIcon';
import type { ColumnConfig } from 'components/Sheet';
import ColumnsGroup from 'components/ColumnsGroup';
import useFieldDefinitions from 'hooks/useFieldDefinitions';
import { clone } from 'utils/fp';
import { batchesExportQuery } from '../query';
import batchColumns, { FieldDefinitionEntityTypes, BatchSheetColumnGroups } from './columns';
import batchTransformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import { batchesQuery } from './query';

type Props = {
  batchIds?: Array<string>,
};

type ImplProps = {
  ...Props,
  columns: Array<ColumnConfig>,
  transformer: Object => Array<Array<CellValue>>,
};

const BatchSheetModuleImpl = ({ batchIds, columns: columnConfigs, transformer }: ImplProps) => {
  const client = useApolloClient();
  const memorizedMutate = React.useCallback(mutate(client), [client]);
  const memorizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(
    data => ({ ...data?.batches, nodes: decorate(clone(data?.batches?.nodes ?? [])) }),
    []
  );
  const batchIdsRef = React.useRef<?Array<string>>(null);

  const {
    initialItems,
    loading,
    hasMore,
    onLoadMore,
    query,
    setQuery,
    filterBy,
    sortBy,
    setSortBy,
    setFilterBy,
  } = useSheet({
    itemsQuery: batchesQuery,
    initialFilterBy: { query: '', archived: false },
    initialSortBy: { updatedAt: 'DESCENDING' },
    getItems,
    cacheKey: 'batch_sheet',
  });
  const { columns, setColumns, columnStates } = useColumnStates({
    columns: columnConfigs,
    sortBy,
    setSortBy,
    cacheKey: 'batch_sheet',
  });
  const exportVariables = useExportedColumns(columnStates);

  if (!!batchIds && !equals(batchIdsRef.current, batchIds)) {
    setFilterBy({ query: '', ids: batchIds });
    batchIdsRef.current = batchIds;
  }

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="BATCH" color="BATCH" subIcon="TABLE" />

        <Filter config={BatchFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig columns={columns} templateType="BatchSheet" onChange={setColumns}>
          {({ getGroupProps }) =>
            BatchSheetColumnGroups.map(type => <ColumnsGroup {...getGroupProps(type)} key={type} />)
          }
        </ColumnsConfig>
        <ExportButton
          type="Batches"
          exportQuery={batchesExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
            ...exportVariables,
          }}
        />
      </NavBar>

      <Sheet
        columns={columnStates}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memorizedMutate}
        handleEntityEvent={memorizedHandler}
        onLoadMore={onLoadMore}
        onItemsSort={sorter}
        actions={{}}
      />
    </Content>
  );
};

const BatchSheetModule = ({ batchIds }: Props) => {
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
    <BatchSheetModuleImpl
      columns={batchColumns(allFieldDefinitions)}
      transformer={batchTransformer(allFieldDefinitions)}
      batchIds={batchIds}
    />
  );
};

export default BatchSheetModule;
