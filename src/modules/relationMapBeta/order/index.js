// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Query } from 'react-apollo';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import { EntityHeader } from 'modules/relationMap/common';
import { SortFilter } from 'modules/relationMap/common/SortFilter';
import AdvancedFilter from 'modules/relationMap/common/SortFilter/AdvancedFilter';
import messages from 'modules/relationMap/messages';
import {
  OrderFocusGridWrapperStyle,
  OrderFocusEntityHeaderWrapperStyle,
  AllShipmentsToggleWrapperStyle,
  AllShipmentsIconStyle,
} from 'modules/relationMap/style';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { Label, ToggleInput, Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import useListConfig from 'hooks/useListConfig';
import {
  OrderListWrapperStyle,
  OrderListBodyStyle,
  ShipmentListWrapperStyle,
  ShipmentListBodyStyle,
} from 'modules/relationMap/orderFocused/style';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';
import { orderListQuery } from './query';
import normalize from './normalize';
import { hasMoreItems, findHighLightEntities } from './helpers';
import { uiInitState, uiReducer, actionCreators, selectors } from './store';
import { DispatchProvider } from './provider';
import OrderFocusView from './components/OrderFocusView';
import Shipment from './components/Shipment';
import ShipmentList from './components/ShipmentList';
import EditForm from './components/EditForm';
import ActionNavbar from './components/ActionNavbar';

type Props = {
  intl: IntlShape,
};

const initFilter = {
  page: 1,
  perPage: 10,
  filter: {
    archived: false,
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
};

const Order = ({ intl }: Props) => {
  const { queryVariables, filterAndSort, onChangeFilter: onChange } = useListConfig(
    initFilter,
    'filterRelationMap'
  );
  const [state, dispatch] = React.useReducer(uiReducer, uiInitState);
  const actions = actionCreators(dispatch);
  const uiSelectors = selectors(state);
  return (
    <DispatchProvider value={{ dispatch, state }}>
      <Query query={orderListQuery} variables={queryVariables} fetchPolicy="network-only">
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }
          const { entities } = normalize({ orders: data && data.orders ? data.orders.nodes : [] });

          const { orders, orderItems, batches, shipments } = entities;
          const highLightEntities = findHighLightEntities(state.highlight, {
            orders,
            orderItems,
            batches,
            shipments,
          });
          return (
            <>
              <SortFilter
                sort={filterAndSort.sort}
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
                    value: 'exporter',
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
                    title: intl.formatMessage(messages.updatedAtSort),
                    value: 'updatedAt',
                  },
                  {
                    title: intl.formatMessage(messages.createdAtSort),
                    value: 'createdAt',
                  },
                ]}
                filter={filterAndSort.filter}
                onChange={onChange}
                onToggle={actions.toggleTag}
                renderAdvanceFilter={({ onChange: onApplyFilter }) => (
                  <AdvancedFilter initialFilter={filterAndSort.filter} onApply={onApplyFilter} />
                )}
              />
              <ActionNavbar
                highLightEntities={highLightEntities}
                batches={batches}
                orders={orders}
                orderItems={orderItems}
              />
              {loading ? (
                <LoadingIcon />
              ) : (
                <div className={OrderFocusGridWrapperStyle}>
                  <div className={OrderFocusEntityHeaderWrapperStyle}>
                    <EntityHeader
                      icon="ORDER"
                      color={
                        uiSelectors.isSelectAllEntity(ORDER, Object.keys(orders || []).length)
                          ? 'ORDER_DARK'
                          : 'ORDER'
                      }
                      label={intl.formatMessage(messages.ordersLabel)}
                      no={Object.keys(orders || []).length}
                      onClick={() => actions.toggleSelectAll(ORDER, Object.keys(orders || []))}
                    />
                    <EntityHeader
                      icon="ORDER_ITEM"
                      color={
                        uiSelectors.isSelectAllEntity(
                          ORDER_ITEM,
                          Object.keys(orderItems || []).length
                        )
                          ? 'ORDER_ITEM_DARK'
                          : 'ORDER_ITEM'
                      }
                      label={intl.formatMessage(messages.itemsLabel)}
                      no={Object.keys(orderItems || []).length}
                      onClick={() =>
                        actions.toggleSelectAll(ORDER_ITEM, Object.keys(orderItems || []))
                      }
                    />
                    <EntityHeader
                      icon="BATCH"
                      color={
                        uiSelectors.isSelectAllEntity(BATCH, Object.keys(batches || []).length)
                          ? 'BATCH_DARK'
                          : 'BATCH'
                      }
                      label={intl.formatMessage(messages.batchesLabel)}
                      no={Object.keys(batches || []).length}
                      onClick={() => actions.toggleSelectAll(BATCH, Object.keys(batches || []))}
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
                      onClick={() =>
                        actions.toggleSelectAll(SHIPMENT, Object.keys(shipments || []))
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
                    </EntityHeader>
                  </div>
                  <div className={OrderListWrapperStyle}>
                    <InfiniteScroll
                      className={OrderListBodyStyle}
                      loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'orders')}
                      hasMore={hasMoreItems(data)}
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
                        onCountShipment={total =>
                          total !== state.totalShipment ? actions.countShipment(total) : null
                        }
                      />
                    ) : (
                      <div className={ShipmentListBodyStyle}>
                        {(Object.entries(shipments || []): Array<any>).map(
                          ([shipmentId, shipment]) => (
                            <Shipment
                              wrapperClassName={ItemWrapperStyle(
                                highLightEntities.includes(`${SHIPMENT}-${shipment.id}`),
                                uiSelectors.isTarget(SHIPMENT, shipment.id),
                                state.highlight.type === SHIPMENT &&
                                  state.highlight.selectedId === shipment.id
                              )}
                              key={shipmentId}
                              {...shipment}
                            />
                          )
                        )}
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
