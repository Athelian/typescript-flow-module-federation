// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import type { BatchPayload, OrganizationPayload } from 'generated/graphql';
import loadMore from 'utils/loadMore';
import useFilterSort from 'hooks/useFilterSort';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import {
  EntityIcon,
  Filter,
  ShipmentFilterConfig,
  ShipmentSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import SlideView from 'components/SlideView';
import ShipmentGridView from 'modules/shipment/list/ShipmentGridView';
import { ShipmentCard } from 'components/Cards';
import { SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { updateBatchMutation } from 'modules/batch/form/mutation';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ValidationCardOverlay from 'components/ValidationCardOverlay';
import { OverlayStyle } from './style';
import { shipmentListQuery } from '../BatchMoveToNewContainerOnExistShipmentAction/query';

type Props = {|
  getBatch: (batchId: string, item: Object) => BatchPayload,
  getImporter: (batchId: string, item: Object) => ?OrganizationPayload,
  getExporter: (batchId: string, item: Object) => ?OrganizationPayload,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

function ShipmentRenderer({
  shipment,
  selected,
  setSelected,
  exporterId,
  importerId,
}: {|
  shipment: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
  importerId: ?string,
  exporterId: ?string,
|}) {
  const hasPermissions = useEntityHasPermissions(shipment);
  const isDifferentImporter = importerId !== shipment.importer?.id;
  const isDifferentExporter = exporterId !== shipment.exporter?.id && shipment.exporter?.id;
  const noPermission = !hasPermissions([BATCH_UPDATE, SHIPMENT_ADD_BATCH]);

  const msg = () => {
    if (noPermission)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.noPermission"
          defaultMessage="No permission"
        />
      );

    if (isDifferentImporter)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.isDifferentImporter"
          defaultMessage="Different importer"
        />
      );

    if (isDifferentExporter)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.isDifferentExporter"
          defaultMessage="Different exporter"
        />
      );

    return null;
  };

  return (
    <ValidationCardOverlay invalidMessage={msg()}>
      <ShipmentCard
        navigable={false}
        shipment={shipment}
        selectable={shipment.id === selected?.id}
        selected={shipment.id === selected?.id}
        onClick={() => {
          setSelected(shipment.id === selected?.id ? null : shipment);
        }}
      />
    </ValidationCardOverlay>
  );
}

const BatchMoveToExistingShipmentActionImpl = ({
  onDone,
  getImporter,
  getExporter,
  getBatch,
  entity,
  item,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [batchUpdate, { loading: isProcessing, called }] = useMutation(updateBatchMutation);
  const [selected, setSelected] = React.useState(null);
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'shipment_cards'
  );
  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };
  const batch = getBatch(entity.id, item);
  const importer = getImporter(entity.id, item);
  const exporter = getExporter(entity.id, item);

  const onMove = (selectedShipment: Object) => {
    executeActionMutation(
      batchUpdate,
      {
        id: batch?.id,
        input: {
          shipmentId: selectedShipment.id,
          containerId: null,
        },
      },
      close
    );
  };

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <SlideViewLayout>
        <SlideViewNavBar>
          <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />
          <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
          <Search query={query} onChange={setQuery} />
          <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />
          <CancelButton onClick={close} />
          <SaveButton disabled={!selected} onClick={() => onMove(selected)} />
        </SlideViewNavBar>
        <Content>
          {(isProcessing || called) && <div className={OverlayStyle} />}
          <Query query={shipmentListQuery} variables={queryVariables} fetchPolicy="network-only">
            {({ loading, data, fetchMore, error }) => {
              if (error) {
                return error.message;
              }

              const nextPage = (data?.shipments?.page ?? 0) + 1;
              const totalPage = data?.shipments?.totalPage ?? 1;
              const hasMore = nextPage <= totalPage;

              return (
                <>
                  <ShipmentGridView
                    items={data?.shipments?.nodes ?? []}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'shipments')}
                    hasMore={hasMore}
                    isLoading={loading}
                    renderItem={shipment => (
                      <ShipmentRenderer
                        key={shipment?.id}
                        selected={selected}
                        setSelected={setSelected}
                        shipment={shipment}
                        exporterId={exporter?.id}
                        importerId={importer?.id}
                      />
                    )}
                  />
                </>
              );
            }}
          </Query>
        </Content>
      </SlideViewLayout>
    </SlideView>
  );
};

const BatchMoveToExistingShipmentAction = (props: Props) => (actions: ActionComponentProps) => (
  <BatchMoveToExistingShipmentActionImpl {...props} {...actions} />
);

export default BatchMoveToExistingShipmentAction;
