// @flow
import * as React from 'react';
import { createObjectValue } from 'react-values';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { Query } from 'react-apollo';
import { isEmpty } from 'utils/fp';
import logger from 'utils/logger';
import { ActionContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import Icon from 'components/Icon';
import { Label, ToggleInput } from 'components/Form';
import OrderFocused from './orderFocused';
import query from './orderFocused/query';
import { formatNodes, formatOrders as formatOrderData } from './orderFocused/formatter';
import { QueryHandler, EntityHeader } from './common';
import ScrollToResult from './common/ScrollToResult';
import { ActionSubscribe } from './common/ActionPanel';
import ActionEffect from './common/ActionEffect';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import AdvancedFilter from './common/SortFilter/AdvancedFilter';
import {
  OrderFocusGridWrapperStyle,
  OrderFocusEntityHeaderWrapperStyle,
  AllShipmentsToggleWrapperStyle,
  AllShipmentsIconStyle,
} from './style';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const Order = ({ intl }: Props) => (
  <SortFilterHandler filter={{ archived: false }}>
    {({ sort, filter, onChangeSortFilter, page, perPage }) => {
      const filterVariables = {
        page,
        perPage,
        filterBy: { ...filter },
        sortBy: { [sort.field]: sort.direction },
      };
      return (
        <Query query={query} variables={filterVariables} fetchPolicy="network-only">
          {({ loading, data, fetchMore, error }) => (
            <Subscribe to={[ActionContainer]}>
              {({ state: { result, scrolled }, setScroll }) => (
                <QueryHandler
                  model="orders"
                  loading={loading}
                  filter={{ perPage }}
                  data={data}
                  fetchMore={fetchMore}
                  error={error}
                >
                  {({ nodes, hasMore, loadMore }) => {
                    const formatedNodes =
                      isEmpty(result) || !nodes ? nodes : formatNodes(nodes, result);
                    const order = formatOrderData(formatedNodes || []);

                    const ShipmentToggleValue = createObjectValue({
                      isToggle: false,
                      total: 0,
                    });

                    return (
                      <>
                        <Subscribe to={[ActionContainer]}>
                          {({ clearResult }) => (
                            <SortFilter
                              sort={sort}
                              sortInputs={[
                                {
                                  title: intl.formatMessage(messages.poNoSort),
                                  value: 'ids',
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
                              filter={filter}
                              onChange={newFilter => {
                                onChangeSortFilter(newFilter);
                                clearResult();
                              }}
                              renderAdvanceFilter={({ onChange: onApplyFilter }) => (
                                <AdvancedFilter
                                  initialFilter={{
                                    query: '',
                                  }}
                                  onApply={onApplyFilter}
                                />
                              )}
                            />
                          )}
                        </Subscribe>

                        <ActionSubscribe filter={filterVariables} />

                        <div className={OrderFocusGridWrapperStyle}>
                          <Subscribe to={[RelationMapContainer]}>
                            {({
                              selectAll: selectAllNative,
                              unSelectAll,
                              state: { targetedItem },
                            }) => {
                              const {
                                order: targetedOrders,
                                orderItem: targetedItems,
                                batch: targetedBatches,
                                shipment: targetedShipments,
                              } = targetedItem;
                              const { sumOrders, sumOrderItems, sumBatches, sumShipments } = order;

                              const isSelected = (selected, totalItem) => {
                                const totalSelected = Object.keys(selected || {}).length;
                                return totalItem === totalSelected;
                              };

                              const orderSelected = isSelected(targetedOrders, sumOrders);
                              const orderItemSelected = isSelected(targetedItems, sumOrderItems);
                              const batchSelected = isSelected(targetedBatches, sumBatches);
                              const shipmentSelected = isSelected(targetedShipments, sumShipments);

                              const selectAll = selectAllNative(order);

                              return (
                                <div className={OrderFocusEntityHeaderWrapperStyle}>
                                  <EntityHeader
                                    icon="ORDER"
                                    color={orderSelected ? 'ORDER_DARK' : 'ORDER'}
                                    label={intl.formatMessage(messages.ordersLabel)}
                                    no={sumOrders}
                                    onClick={() => {
                                      if (!orderSelected && selectAll) {
                                        selectAll('order');
                                      }
                                      if (orderSelected && unSelectAll) {
                                        unSelectAll('order');
                                      }
                                    }}
                                  />
                                  <EntityHeader
                                    icon="ORDER_ITEM"
                                    color={orderItemSelected ? 'ORDER_ITEM_DARK' : 'ORDER_ITEM'}
                                    label={intl.formatMessage(messages.itemsLabel)}
                                    no={sumOrderItems}
                                    onClick={() => {
                                      if (!orderItemSelected && selectAll) {
                                        selectAll('orderItem');
                                      }
                                      if (orderItemSelected && unSelectAll) {
                                        unSelectAll('orderItem');
                                      }
                                    }}
                                  />
                                  <EntityHeader
                                    icon="BATCH"
                                    color={batchSelected ? 'BATCH_DARK' : 'BATCH'}
                                    label={intl.formatMessage(messages.batchesLabel)}
                                    no={sumBatches}
                                    onClick={() => {
                                      if (!batchSelected && selectAll) {
                                        selectAll('batch');
                                      }
                                      if (batchSelected && unSelectAll) {
                                        unSelectAll('batch');
                                      }
                                    }}
                                  />
                                  <ShipmentToggleValue>
                                    {({ value: { isToggle, total }, assign }) => (
                                      <EntityHeader
                                        icon="SHIPMENT"
                                        color={shipmentSelected ? 'SHIPMENT_DARK' : 'SHIPMENT'}
                                        label={intl.formatMessage(messages.shipmentsLabel)}
                                        no={sumShipments + total}
                                        onClick={() => {
                                          if (!shipmentSelected && selectAll) {
                                            selectAll('shipment');
                                          }
                                          if (shipmentSelected && unSelectAll) {
                                            unSelectAll('shipment');
                                          }
                                        }}
                                      >
                                        <div className={AllShipmentsToggleWrapperStyle}>
                                          <div className={AllShipmentsIconStyle}>
                                            <Icon icon="SHIPMENT" />
                                          </div>
                                          <Label>
                                            <FormattedMessage
                                              id="modules.RelationMaps.label.all"
                                              defaultMessage="All"
                                            />{' '}
                                            <FormattedMessage {...messages.shipmentsLabel} />
                                          </Label>
                                          <ToggleInput
                                            toggled={isToggle}
                                            onToggle={() =>
                                              assign({
                                                isToggle: !isToggle,
                                                total: 0,
                                              })
                                            }
                                          />
                                        </div>
                                      </EntityHeader>
                                    )}
                                  </ShipmentToggleValue>
                                </div>
                              );
                            }}
                          </Subscribe>

                          <ScrollToResult
                            id="OrderMapWrapper"
                            result={result}
                            scrolled={scrolled}
                            setScroll={setScroll}
                          >
                            {({ id }) => (
                              <OrderFocused
                                id={id}
                                order={order}
                                hasMore={hasMore}
                                loadMore={loadMore}
                                nodes={formatedNodes}
                                ShipmentToggleValue={ShipmentToggleValue}
                              />
                            )}
                          </ScrollToResult>
                        </div>
                      </>
                    );
                  }}
                </QueryHandler>
              )}
            </Subscribe>
          )}
        </Query>
      );
    }}
  </SortFilterHandler>
);

export default injectIntl(Order);
