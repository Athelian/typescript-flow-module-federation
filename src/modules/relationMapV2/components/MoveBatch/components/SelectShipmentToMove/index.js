// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import FilterToolBar from 'components/common/FilterToolBar';
import { shipmentSortMessages } from 'modules/shipment/messages';
import ShipmentGridView from 'modules/shipment/list/ShipmentGridView';
import { ShipmentCard } from 'components/Cards';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { BATCH } from 'modules/relationMapV2/constants';
import { OverlayStyle } from './style';
import { shipmentListQuery } from './query';
import { moveBatchesToShipment } from './mutation';

type Props = {
  intl: IntlShape,
  onSuccess: (orderIds: Array<string>, shipmentIds: Array<string>) => void,
  onNewContainer: (shipment: Object) => void,
};

function ShipmentRenderer({
  shipment,
  selected,
  setSelected,
}: {
  shipment: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
}) {
  const { state } = FocusedView.useContainer();
  const { shipmentIds, importerIds, exporterIds } = state.moveActions;
  const isSameParent = shipmentIds.length === 1 && shipmentIds.includes(shipment.id);
  const hasPermissions = useEntityHasPermissions(shipment);
  const isDifferentImporter = !importerIds.includes(shipment.importer?.id);
  const isDifferentExporter =
    (exporterIds.length === 1 &&
      !exporterIds.includes(shipment.exporter?.id) &&
      shipment.exporter?.id) ||
    (exporterIds.length > 1 && shipment.exporter?.id);
  const noPermission = !hasPermissions([BATCH_UPDATE, SHIPMENT_ADD_BATCH]);
  const isInvalid = isSameParent || isDifferentImporter || isDifferentExporter || noPermission;
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
    <div
      style={{
        width: 860,
        height: 164,
        position: 'relative',
      }}
    >
      {isInvalid && (
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            width: 860,
            height: 164,
            backgroundColor: 'rgba(239, 72, 72, 0.25)',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          {msg()}
        </div>
      )}
      <ShipmentCard
        navigable={false}
        shipment={shipment}
        selectable={shipment.id === selected?.id}
        selected={shipment.id === selected?.id}
        onClick={() => {
          setSelected(shipment.id === selected?.id ? null : shipment);
        }}
      />
    </div>
  );
}

function SelectShipmentToMove({ intl, onSuccess, onNewContainer }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, type, from, orderIds } = state.moveActions;
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

  const sortFields = [
    { title: intl.formatMessage(shipmentSortMessages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(shipmentSortMessages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(shipmentSortMessages.shipmentId), value: 'no' },
    { title: intl.formatMessage(shipmentSortMessages.blNo), value: 'blNo' },
    { title: intl.formatMessage(shipmentSortMessages.vesselName), value: 'vesselName' },
    { title: intl.formatMessage(shipmentSortMessages.cargoReady), value: 'cargoReady' },
    {
      title: intl.formatMessage(shipmentSortMessages.loadPortDeparture),
      value: 'loadPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.firstTransitPortArrival),
      value: 'firstTransitPortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.firstTransitPortDeparture),
      value: 'firstTransitPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.secondTransitPortArrival),
      value: 'secondTransitPortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.secondTransitPortDeparture),
      value: 'secondTransitPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.dischargePortArrival),
      value: 'dischargePortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.customClearance),
      value: 'customClearance',
    },
    { title: intl.formatMessage(shipmentSortMessages.warehouseArrival), value: 'warehouseArrival' },
    {
      title: intl.formatMessage(shipmentSortMessages.deliveryReady),
      value: 'deliveryReady',
    },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
      filter: {
        query: '',
        archived: false,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    'filterShipmentOnMoveNRM'
  );
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
            <FilterToolBar
              icon="SHIPMENT"
              sortFields={sortFields}
              filtersAndSort={filterAndSort}
              onChange={onChangeFilter}
              canArchive
              canSearch
            />
            <CancelButton onClick={onCancel} />
            <SaveButton
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

export default injectIntl(SelectShipmentToMove);
