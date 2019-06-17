// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { intersection, flatten } from 'lodash';
import { Query } from 'react-apollo';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import logger from 'utils/logger';
import usePermission from 'hooks/usePermission';
import usePrevious from 'hooks/usePrevious';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import useFilter from 'hooks/useFilter';
import Icon from 'components/Icon';
import { Label, ToggleInput, Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'constants/keywords';
import { SearchInput, SortInput } from 'components/NavBar';
import { currentSort } from 'components/common/FilterToolBar';
import { shipmentSortMessages } from 'modules/shipment/messages';
import AdvancedFilter from '../common/SortFilter/AdvancedFilter';
import messages from '../messages';
import SortFilter from '../common/SortFilter';
import {
  OrderFocusGridWrapperStyle,
  OrderFocusEntityHeaderWrapperStyle,
  AllShipmentsToggleWrapperStyle,
  AllShipmentsIconStyle,
} from '../style';
import EntityHeader from '../common/EntityHeader';
import { orderListQuery, orderDetailQuery, shipmentDetailQuery } from './query';
import {
  OrderListWrapperStyle,
  OrderListBodyStyle,
  ShipmentListWrapperStyle,
  ShipmentListBodyStyle,
  ItemWrapperStyle,
} from './style';
import normalize from './normalize';
import { hasMoreItems, findHighLightEntities } from './helpers';
import { uiInitState, uiReducer, actionCreators, selectors } from './store';
import { DispatchProvider } from './provider';
import OrderFocusView from './components/OrderFocusView';
import Shipment from './components/Shipment';
import ShipmentList from './components/ShipmentList';
import EditForm from './components/EditForm';
import ActionNavbar from './components/ActionNavbar';
import { prepareOrderInput } from './components/ActionNavbar/helper';
import { updateOrderMutation } from './components/ActionNavbar/MoveToOrderPanel/mutation';
import { initOrderFilter, initShipmentFilter, manualSortByAction } from './initOrderFilter';

type Props = {
  intl: IntlShape,
};

const Order = ({ intl }: Props) => {
  const [state, dispatch] = React.useReducer(uiReducer, uiInitState());
  const actions = actionCreators(dispatch);
  const uiSelectors = selectors(state);
  const { hasPermission } = usePermission();

  const shipmentSortFields = [
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

  const {
    queryVariables: queryOrderVariables,
    filterAndSort: orderFilterAndSort,
    onChangeFilter: onChangeOrderFilter,
  } = useFilter(initOrderFilter, 'filterRelationMap');

  const {
    queryVariables: queryShipmentVariables,
    filterAndSort: shipmentFilterAndSort,
    onChangeFilter: onChangeShipmentFilter,
  } = useFilter(initShipmentFilter, 'allShipmentFilter');

  const lastOrderFilter = usePrevious(orderFilterAndSort);

  React.useEffect(() => {
    if (!isEquals(lastOrderFilter, orderFilterAndSort)) {
      actions.reset();
    }
  });

  return (
    <DispatchProvider value={{ dispatch, state }}>
      <Query
        key={JSON.stringify(queryOrderVariables)}
        query={orderListQuery}
        variables={queryOrderVariables}
        fetchPolicy="network-only"
      >
        {({ loading, data, refetch, fetchMore, error, client, updateQuery }) => {
          if (error) {
            return error.message;
          }

          if (loading) {
            return <LoadingIcon />;
          }

          if (state.refetchAll) {
            refetch(queryOrderVariables)
              .then(() => actions.setRefetchAll(false))
              .catch(logger.error);
          }

          if (state.refetch.shipmentIds.length > 0) {
            const [newShipmentId] = state.refetch.shipmentIds;
            actions.refetchQueryBy('SHIPMENT', []);
            const queryOption: any = {
              query: shipmentDetailQuery,
              variables: {
                id: newShipmentId,
              },
            };
            client
              .query(queryOption)
              .then(responseData => {
                updateQuery(prevResult => {
                  const { entities } = normalize({
                    shipments: state.toggleShipmentList ? state.shipments : [],
                    orders: data && data.orders ? data.orders.nodes : [],
                  });
                  const { orders, orderItems } = entities;

                  const batchIds = uiSelectors.targetedBatchIds();
                  const allOrderItemIds = [];
                  (Object.entries(orderItems || {}): Array<any>).forEach(
                    ([orderItemId, orderItem]) => {
                      if (
                        !allOrderItemIds.includes(orderItemId) &&
                        intersection(orderItem.batches, batchIds).length > 0
                      ) {
                        allOrderItemIds.push(orderItemId);
                      }
                    }
                  );
                  const allOrderIds = [];
                  (Object.entries(orders || {}): Array<any>).forEach(([orderId, order]) => {
                    if (
                      !allOrderIds.includes(orderId) &&
                      intersection(order.orderItems, allOrderItemIds).length > 0
                    ) {
                      allOrderIds.push(orderId);
                    }
                  });

                  if (prevResult && prevResult.orders && prevResult.orders.nodes) {
                    prevResult.orders.nodes
                      .filter(order => allOrderIds.includes(order.id))
                      .forEach(order => {
                        // insert on the top
                        order.shipments.push(responseData.data.shipment);
                      });
                    actions.scrollToShipment(newShipmentId);
                  } else if (allOrderIds.length > 0) {
                    actions.refetchQueryBy('ORDER', allOrderIds);
                  }

                  scrollIntoView({
                    targetId: `shipment-${newShipmentId}`,
                  });
                  return prevResult;
                });
              })
              .catch(logger.error);
          }

          if (state.refetch.orderIds.length > 0) {
            const [newOrderId] = state.refetch.orderIds;
            const { updateOrdersInput = [] } = state.new;
            actions.refetchQueryBy('ORDER', []);
            Promise.all(
              updateOrdersInput.map(item =>
                client.mutate({
                  mutation: updateOrderMutation,
                  variables: {
                    id: item.id,
                    input: prepareOrderInput(
                      {
                        orderItems: item.oldOrderItems,
                        currency: item.oldCurrency,
                      },
                      {
                        currency: item.newCurrency,
                        orderItems: item.orderItems,
                      }
                    ),
                  },
                })
              )
            )
              .then(() => {})
              .catch(logger.error);
            const queryOption: any = {
              query: orderDetailQuery,
              variables: {
                id: newOrderId,
              },
            };
            client
              .query(queryOption)
              .then(responseData => {
                updateQuery(prevResult => {
                  // insert on the top
                  if (
                    prevResult.orders &&
                    responseData.data.order &&
                    !prevResult.orders.nodes.includes(responseData.data.order)
                  ) {
                    prevResult.orders.nodes.splice(0, 0, responseData.data.order);
                  }
                  scrollIntoView({
                    targetId: `order-${newOrderId}`,
                  });

                  actions.targetNewEntities([
                    ...getByPathWithDefault([], 'order.orderItems', responseData.data).map(
                      orderItem => ({
                        entity: ORDER_ITEM,
                        id: orderItem.id,
                        exporterId: `${ORDER_ITEM}-${getByPathWithDefault(
                          '',
                          'order.exporter.id',
                          responseData.data
                        )}`,
                      })
                    ),
                    ...getByPathWithDefault([], 'order.orderItems', responseData.data).reduce(
                      (result, orderItem) =>
                        result.concat(
                          orderItem.batches.map(batch => ({
                            entity: BATCH,
                            id: batch.id,
                            exporterId: `${BATCH}-${getByPathWithDefault(
                              '',
                              'order.exporter.id',
                              responseData.data
                            )}`,
                          }))
                        ),
                      []
                    ),
                  ]);
                  return prevResult;
                });
              })
              .catch(logger.error);
          }

          const { entities } = normalize({
            shipments: state.toggleShipmentList ? state.shipments : [],
            orders: data && data.orders ? data.orders.nodes : [],
          });
          const { orders, orderItems, batches, shipments } = entities;
          const highLightEntities = findHighLightEntities(state.highlight, {
            orders,
            orderItems,
            batches,
            shipments,
          });
          const allowToUpdate = hasPermission(RM_ORDER_FOCUS_MANIPULATE);
          const orderIds = getByPathWithDefault([], 'orders.nodes', data).map(order => order.id);
          const itemIds = flatten(
            Object.keys(orders || {})
              .filter(orderId => orderIds.includes(orderId))
              .map(orderId => orders[orderId].orderItems)
          );
          const batchIds = flatten(
            Object.keys(orderItems || {})
              .filter(itemId => itemIds.includes(itemId))
              .map(itemId => orderItems[itemId].batches)
          );
          return (
            <>
              <SortFilter
                sort={orderFilterAndSort.sort}
                sortInputs={[
                  {
                    title: intl.formatMessage(messages.poNoSort),
                    value: 'poNo',
                  },
                  {
                    title: intl.formatMessage(messages.piNoSort),
                    value: 'piNo',
                  },
                  {
                    title: intl.formatMessage(messages.issuedAtSort),
                    value: 'issuedAt',
                  },
                  {
                    title: intl.formatMessage(messages.exporterSort),
                    value: 'exporterName',
                  },
                  {
                    title: intl.formatMessage(messages.currencySort),
                    value: 'currency',
                  },
                  {
                    title: intl.formatMessage(messages.incotermSort),
                    value: 'incoterm',
                  },
                  {
                    title: intl.formatMessage(messages.deliveryPlaceSort),
                    value: 'deliveryPlace',
                  },
                  {
                    title: intl.formatMessage(messages.updatedAt),
                    value: 'updatedAt',
                  },
                  {
                    title: intl.formatMessage(messages.createdAt),
                    value: 'createdAt',
                  },
                ]}
                filter={orderFilterAndSort.filter}
                onChange={onChangeOrderFilter}
                onToggle={actions.toggleTag}
                renderAdvanceFilter={({ onChange: onApplyFilter }) => (
                  <AdvancedFilter
                    initialFilter={orderFilterAndSort.filter}
                    onApply={onApplyFilter}
                  />
                )}
              />
              <ActionNavbar highLightEntities={highLightEntities} entities={entities} />
              {loading ? (
                <LoadingIcon />
              ) : (
                <div className={OrderFocusGridWrapperStyle}>
                  <div className={OrderFocusEntityHeaderWrapperStyle}>
                    <EntityHeader
                      icon="ORDER"
                      color={
                        uiSelectors.isSelectAllEntity(ORDER, orderIds.length)
                          ? 'ORDER_DARK'
                          : 'ORDER'
                      }
                      label={intl.formatMessage(messages.ordersLabel)}
                      no={orderIds.length}
                      onClick={
                        allowToUpdate ? () => actions.toggleSelectAll(ORDER, orderIds) : null
                      }
                    />
                    <EntityHeader
                      icon="ORDER_ITEM"
                      color={
                        uiSelectors.isSelectAllEntity(ORDER_ITEM, itemIds.length)
                          ? 'ORDER_ITEM_DARK'
                          : 'ORDER_ITEM'
                      }
                      label={intl.formatMessage(messages.itemsLabel)}
                      no={itemIds.length}
                      onClick={
                        allowToUpdate ? () => actions.toggleSelectAll(ORDER_ITEM, itemIds) : null
                      }
                    />
                    <EntityHeader
                      icon="BATCH"
                      color={
                        uiSelectors.isSelectAllEntity(BATCH, batchIds.length)
                          ? 'BATCH_DARK'
                          : 'BATCH'
                      }
                      label={intl.formatMessage(messages.batchesLabel)}
                      no={batchIds.length}
                      onClick={
                        allowToUpdate ? () => actions.toggleSelectAll(BATCH, batchIds) : null
                      }
                    />
                    <EntityHeader
                      icon="SHIPMENT"
                      color={
                        uiSelectors.isSelectAllEntity(SHIPMENT, Object.keys(shipments || []).length)
                          ? 'SHIPMENT_DARK'
                          : 'SHIPMENT'
                      }
                      label={intl.formatMessage(messages.shipmentsLabel)}
                      no={
                        state.toggleShipmentList
                          ? state.totalShipment
                          : Object.keys(shipments || []).length
                      }
                      onClick={
                        allowToUpdate
                          ? () => actions.toggleSelectAll(SHIPMENT, Object.keys(shipments || []))
                          : null
                      }
                    >
                      <div className={AllShipmentsToggleWrapperStyle}>
                        <div className={AllShipmentsIconStyle}>
                          <Icon icon="SHIPMENT" />
                        </div>
                        <Label>
                          <FormattedMessage
                            id="modules.RelationMaps.label.all"
                            defaultMessage="All"
                          />
                          <FormattedMessage {...messages.shipmentsLabel} />
                        </Label>
                        <ToggleInput
                          toggled={state.toggleShipmentList}
                          onToggle={() => {
                            if (state.toggleShipmentList) {
                              onChangeShipmentFilter({
                                ...shipmentFilterAndSort,
                                filter: { ...shipmentFilterAndSort.filter, query: '' },
                              });
                            }
                            actions.toggleShipmentList();
                            if (window.localStorage) {
                              window.localStorage.setItem(
                                'filterRMShipmentToggle',
                                JSON.stringify({ isToggle: !state.toggleShipmentList })
                              );
                            }
                          }}
                        />
                      </div>

                      {state.toggleShipmentList && (
                        <>
                          <SortInput
                            sort={currentSort(shipmentSortFields, shipmentFilterAndSort.sort)}
                            ascending={shipmentFilterAndSort.sort.direction !== 'DESCENDING'}
                            fields={shipmentSortFields}
                            onChange={({ field: { value }, ascending }) =>
                              onChangeShipmentFilter({
                                ...shipmentFilterAndSort,
                                sort: {
                                  field: value,
                                  direction: ascending ? 'ASCENDING' : 'DESCENDING',
                                },
                              })
                            }
                          />

                          <SearchInput
                            value={shipmentFilterAndSort.filter.query}
                            name="search"
                            onClear={() =>
                              onChangeShipmentFilter({
                                ...shipmentFilterAndSort,
                                filter: { ...shipmentFilterAndSort.filter, query: '' },
                              })
                            }
                            onChange={newQuery =>
                              onChangeShipmentFilter({
                                ...shipmentFilterAndSort,
                                filter: { ...shipmentFilterAndSort.filter, query: newQuery },
                              })
                            }
                          />
                        </>
                      )}
                    </EntityHeader>
                  </div>
                  <div className={OrderListWrapperStyle}>
                    <InfiniteScroll
                      className={OrderListBodyStyle}
                      loadMore={() => loadMore({ fetchMore, data }, queryOrderVariables, 'orders')}
                      hasMore={hasMoreItems(data, 'orders')}
                      loader={<LoadingIcon key="loading" />}
                      useWindow={false}
                      threshold={500}
                    >
                      {getByPathWithDefault([], 'orders.nodes', data).map(order => (
                        <OrderFocusView
                          highLightEntities={highLightEntities}
                          key={order.id}
                          item={order}
                        />
                      ))}
                      {Object.entries(orders || []).length === 0 && (
                        <Display>
                          <FormattedMessage
                            id="modules.Orders.noOrderFound"
                            defaultMessage="No orders found"
                          />
                        </Display>
                      )}
                    </InfiniteScroll>
                  </div>
                  <div className={ShipmentListWrapperStyle}>
                    {state.toggleShipmentList ? (
                      <ShipmentList
                        highLightEntities={highLightEntities}
                        onCountShipment={allShipments =>
                          allShipments.length !== state.totalShipment
                            ? actions.countShipment(allShipments.length, allShipments)
                            : null
                        }
                        queryVariables={queryShipmentVariables}
                      />
                    ) : (
                      <div className={ShipmentListBodyStyle}>
                        {manualSortByAction(shipments, state).map(shipment => (
                          <Shipment
                            wrapperClassName={ItemWrapperStyle(
                              highLightEntities.includes(`${SHIPMENT}-${shipment.id}`),
                              uiSelectors.isTarget(SHIPMENT, shipment.id),
                              state.highlight.type === SHIPMENT &&
                                state.highlight.selectedId === shipment.id
                            )}
                            key={shipment.id}
                            {...shipment}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <EditForm onClose={() => actions.showEditForm('', '')} {...state.edit} />
            </>
          );
        }}
      </Query>
    </DispatchProvider>
  );
};

export default injectIntl(Order);
