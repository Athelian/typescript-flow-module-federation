// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useApolloClient } from '@apollo/react-hooks';
import { equals } from 'ramda';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, ShipmentFilterConfig } from 'components/NavBar';
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
import ColumnsGroup from 'components/Sheet/ColumnsConfig/ColumnsGroup';
import useFieldDefinitions from 'hooks/useFieldDefinitions';
import { clone } from 'utils/fp';
import { shipmentsExportQuery } from '../query';
import shipmentColumns, { FieldDefinitionEntityTypes, ShipmentSheetColumnGroups } from './columns';
import shipmentTransformer from './transformer';
import entityEventHandler from './handler';
import actions from './actions';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import { shipmentsQuery } from './query';

type Props = {
  shipmentIds?: Array<string>,
};

type ImplProps = {
  ...Props,
  columns: Array<ColumnConfig>,
  transformer: Object => Array<Array<CellValue>>,
};

const ShipmentSheetModuleImpl = ({
  shipmentIds,
  columns: columnConfigs,
  transformer,
}: ImplProps) => {
  const client = useApolloClient();
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(
    data => ({ ...data?.shipments, nodes: decorate(clone(data?.shipments?.nodes ?? [])) }),
    []
  );
  const shipmentIdsRef = React.useRef<?Array<string>>(null);

  const {
    initialItems,
    loading,
    hasMore,
    onLoadMore,
    query,
    setQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
  } = useSheet({
    itemsQuery: shipmentsQuery,
    initialFilterBy: { query: '', archived: false },
    initialSortBy: { updatedAt: 'DESCENDING' },
    getItems,
    cacheKey: 'shipment_sheet',
  });
  const { columns, setColumns, columnStates } = useColumnStates({
    columns: columnConfigs,
    sortBy,
    setSortBy,
    cacheKey: 'shipment_sheet',
  });
  const exportVariables = useExportedColumns(columnStates);

  if (!!shipmentIds && !equals(shipmentIdsRef.current, shipmentIds)) {
    setFilterBy({ query: '', ids: shipmentIds });
    shipmentIdsRef.current = shipmentIds;
  }

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="TABLE" />

        <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig
          defaultColumns={columnConfigs}
          columns={columns}
          templateType="ShipmentSheet"
          onChange={setColumns}
        >
          {({ getGroupProps }) =>
            ShipmentSheetColumnGroups.map(type => (
              <ColumnsGroup {...getGroupProps(type)} key={type} />
            ))
          }
        </ColumnsConfig>
        <ExportButton
          type="Shipments"
          exportQuery={shipmentsExportQuery}
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
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLoadMore={onLoadMore}
        onItemsSort={sorter}
        actions={actions}
      />
    </Content>
  );
};

const ShipmentSheetModule = ({ shipmentIds }: Props) => {
  const intl = useIntl();
  const { fieldDefinitions, loading } = useFieldDefinitions(FieldDefinitionEntityTypes);

  if (loading) {
    return <LoadingIcon />;
  }

  const allFieldDefinitions = {
    orderFieldDefinitions: fieldDefinitions?.Order ?? [],
    orderItemFieldDefinitions: fieldDefinitions?.OrderItem ?? [],
    batchFieldDefinitions: fieldDefinitions?.Batch ?? [],
    shipmentFieldDefinitions: fieldDefinitions?.Shipment ?? [],
    productFieldDefinitions: fieldDefinitions?.Product ?? [],
  };

  return (
    <ShipmentSheetModuleImpl
      columns={shipmentColumns(allFieldDefinitions)}
      transformer={shipmentTransformer({ ...allFieldDefinitions, intl })}
      shipmentIds={shipmentIds}
    />
  );
};

export default ShipmentSheetModule;
