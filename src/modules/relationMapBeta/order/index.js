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
import { OrderListWrapperStyle, OrderListBodyStyle } from 'modules/relationMap/orderFocused/style';
import query from './query';
import normalize from './normalize';
import { useFilter } from '../hooks';
import OrderFocusView from './components/OrderFocusView';
import type { OrderFocusProps } from './type.js.flow';

type Props = {
  intl: IntlShape,
};

const hasMoreItems = data => {
  const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
  return nextPage <= totalPage;
};

const Order = ({ intl }: Props) => {
  const { queryVariables, filterAndSort, onChange } = useFilter({
    page: 1,
    perPage: 10,
    filter: {
      archived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  });
  return (
    <Query query={query} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const {
          entities: { orders, orderItems, batches, shipments },
        } = normalize({ orders: data && data.orders ? data.orders.nodes : [] });
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
              renderAdvanceFilter={({ onChange: onApplyFilter }) => (
                <AdvancedFilter
                  initialFilter={{
                    archived: false,
                  }}
                  onApply={onApplyFilter}
                />
              )}
            />
            {loading ? (
              <LoadingIcon />
            ) : (
              <div className={OrderFocusGridWrapperStyle}>
                <div className={OrderFocusEntityHeaderWrapperStyle}>
                  <EntityHeader
                    icon="ORDER"
                    // color={orderSelected ? 'ORDER_DARK' : 'ORDER'}
                    color="ORDER"
                    label={intl.formatMessage(messages.ordersLabel)}
                    no={Object.keys(orders || []).length}
                    onClick={() => {
                      // if (!orderSelected && selectAll) {
                      //   selectAll('order');
                      // }
                      // if (orderSelected && unSelectAll) {
                      //   unSelectAll('order');
                      // }
                    }}
                  />
                  <EntityHeader
                    icon="ORDER_ITEM"
                    color="ORDER_ITEM"
                    // color={orderItemSelected ? 'ORDER_ITEM_DARK' : 'ORDER_ITEM'}
                    label={intl.formatMessage(messages.itemsLabel)}
                    no={Object.keys(orderItems || []).length}
                    // no={sumOrderItems}
                    onClick={() => {
                      // if (!orderItemSelected && selectAll) {
                      //   selectAll('orderItem');
                      // }
                      // if (orderItemSelected && unSelectAll) {
                      //   unSelectAll('orderItem');
                      // }
                    }}
                  />
                  <EntityHeader
                    icon="BATCH"
                    color="BATCH"
                    // color={batchSelected ? 'BATCH_DARK' : 'BATCH'}
                    label={intl.formatMessage(messages.batchesLabel)}
                    no={Object.keys(batches || []).length}
                    onClick={() => {
                      // if (!batchSelected && selectAll) {
                      //   selectAll('batch');
                      // }
                      // if (batchSelected && unSelectAll) {
                      //   unSelectAll('batch');
                      // }
                    }}
                  />
                  <EntityHeader
                    icon="SHIPMENT"
                    color="SHIPMENT"
                    // color={shipmentSelected ? 'SHIPMENT_DARK' : 'SHIPMENT'}
                    label={intl.formatMessage(messages.shipmentsLabel)}
                    // no={sumShipments + total}
                    no={Object.keys(shipments || []).length}
                    onClick={() => {
                      // if (!shipmentSelected && selectAll) {
                      //   selectAll('shipment');
                      // }
                      // if (shipmentSelected && unSelectAll) {
                      //   unSelectAll('shipment');
                      // }
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
                        />
                        <FormattedMessage {...messages.shipmentsLabel} />
                      </Label>
                      <ToggleInput
                        toggled={false}
                        onToggle={() => {
                          // assign({
                          //   isToggle: !isToggle,
                          //   total: 0,
                          // })
                        }}
                      />
                    </div>
                  </EntityHeader>
                </div>
                <div className={OrderListWrapperStyle}>
                  {orders ? (
                    <InfiniteScroll
                      className={OrderListBodyStyle}
                      loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'orders')}
                      hasMore={hasMoreItems(data)}
                      loader={<LoadingIcon key="loading" />}
                      useWindow={false}
                      threshold={500}
                    >
                      {(Object.entries(orders): Array<any>).map(
                        ([orderId, item]: [string, OrderFocusProps]) => (
                          <OrderFocusView key={orderId} item={item} />
                        )
                      )}
                    </InfiniteScroll>
                  ) : (
                    <Display>
                      <FormattedMessage
                        id="modules.Orders.noOrderFound"
                        defaultMessage="No orders found"
                      />
                    </Display>
                  )}
                </div>
              </div>
            )}
          </>
        );
      }}
    </Query>
  );
};

export default injectIntl(Order);
