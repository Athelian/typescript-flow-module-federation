// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import useFilterSort from 'hooks/useFilterSort';
import loadMore from 'utils/loadMore';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
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
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { OverlayStyle } from './style';
import { shipmentListQuery } from './query';
import { moveBatchesToShipment } from './mutation';
import ValidationCardOverlay from '../ValidationCardOverlay';

type Props = {|
  onSuccess: (orderIds: Array<string>, shipmentIds: Array<string>) => void,
  onNewContainer: (shipment: Object) => void,
|};

function ShipmentRenderer({
  shipment,
  selected,
  setSelected,
}: {|
  shipment: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
|}) {
  const { state, selectors } = FocusedView.useContainer();
  const batchIds = selectors.targetedBatchIds();
  const { mapping } = Entities.useContainer();
  const { shipmentIds, importerIds, exporterIds } = state.moveActions;
  const isSameParent =
    shipmentIds.length === 1 &&
    shipmentIds.includes(shipment.id) &&
    batchIds.every(batchId => !!mapping.entities?.batches?.[batchId]?.shipment);
  const hasPermissions = useEntityHasPermissions(shipment);
  const isDifferentImporter = !importerIds.includes(shipment.importer?.id);
  const isDifferentExporter =
    (exporterIds.length === 1 &&
      !exporterIds.includes(shipment.exporter?.id) &&
      shipment.exporter?.id) ||
    (exporterIds.length > 1 && shipment.exporter?.id);
  const noPermission = !hasPermissions([BATCH_UPDATE, SHIPMENT_ADD_BATCH]);

  const msg = () => {
    if (noPermission)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.noPermission"
          defaultMessage="No permission"
        />
      );

    if (isSameParent)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.sameParentShipment"
          defaultMessage="Same parent shipment"
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

function SelectShipmentToMove({ onSuccess, onNewContainer }: Props) {
  const { dispatch, state, selectors } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, type, from, orderIds } = state.moveActions;
  const batchIds = selectors.targetedBatchIds();
  const isMoveFromBatch = from === 'batch';
  const isMoveToContainer = type === 'newContainer';
  const isMoveToShipment = type === 'existShipment';
  React.useEffect(() => {
    return () => {
      if (isOpen) setSelected(null);
    };
  }, [isOpen]);
  const onCancel = () => {
    dispatch({
      type: 'MOVE_TO_SHIPMENT_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    if (isMoveToContainer) {
      onNewContainer(selected);
    } else {
      dispatch({
        type: 'MOVE_TO_SHIPMENT_START',
        payload: {},
      });
      moveBatchesToShipment({
        batchIds,
        orderIds,
        viewer: state.viewer,
        shipment: selected,
        entities: mapping.entities,
      })
        .then(result => onSuccess(result.orderIds, result.shipmentIds))
        .catch(onCancel);
    }
  };

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'shipment_cards'
  );
  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };
  const isValid = (isMoveToContainer || isMoveToShipment) && isMoveFromBatch;

  return (
    <SlideView
      shouldConfirm={() => !!selected}
      isOpen={isOpen && isValid}
      onRequestClose={onCancel}
    >
      {isOpen && isValid && (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />
            <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
            <Search query={query} onChange={setQuery} />
            <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />
            <CancelButton onClick={onCancel} />
            <SaveButton
              {...(isMoveToContainer && {
                label: (
                  <FormattedMessage id="components.button.continue" defaultMessage="Continue" />
                ),
              })}
              disabled={!selected || isProcessing}
              isLoading={isProcessing}
              onClick={onConfirm}
            />
          </SlideViewNavBar>
          <Content>
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
                    {isProcessing && <div className={OverlayStyle} />}
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
                        />
                      )}
                    />
                  </>
                );
              }}
            </Query>
          </Content>
        </SlideViewLayout>
      )}
    </SlideView>
  );
}

export default SelectShipmentToMove;
