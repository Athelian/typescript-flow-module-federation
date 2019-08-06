// @flow
import * as React from 'react';
import type { OrderPayload, BatchPayload } from 'generated/graphql';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import styled from 'react-emotion';
import apolloClient from 'apollo';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { uuid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import { Display } from 'components/Form';
import BaseCard from 'components/Cards';
import { orderFocusedListQuery, orderFocusDetailQuery } from 'modules/relationMapV2/query';
import RelationLine from '../RelationLine';
import { WrapperStyle, HeadingStyle, ContentStyle, ScrollWrapperStyle } from './style';

type Entity = 'order' | 'batch' | 'orderItem' | 'container' | 'shipment';

type CellRender = {
  type: | 'order'
    | 'duplicateOrder'
    | 'duplicateOrderItem'
    | 'orderItem'
    | 'batch'
    | 'shipment'
    | 'shipmentWithoutContainer'
    | 'container'
    | 'itemSummary'
    | 'batchSummary'
    | 'containerSummary'
    | 'shipmentSummary'
    | 'placeholder',
  data?: mixed,
  entity?: Entity,
  beforeConnector?: ?number,
  afterConnector?: ?number,
  isLoadedData?: boolean,
};

const OrderCard = styled.div`
  width: 285px;
  height: 55px;
`;
const ItemCard = styled.div`
  width: 465px;
  height: 55px;
`;
const BatchCard = styled.div`
  width: 445px;
  height: 55px;
`;
const ContainerCard = styled.div`
  width: 375px;
  height: 55px;
`;
const ShipmentCard = styled.div`
  width: 515px;
  height: 55px;
`;

function Header() {
  return (
    <>
      <div
        className={HeadingStyle}
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#ED5724',
        }}
      >
        Orders
      </div>
      <div
        className={HeadingStyle}
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#FBAA1D',
        }}
      >
        Items
      </div>
      <div
        className={HeadingStyle}
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#12B937',
        }}
      >
        Batches
      </div>
      <div
        className={HeadingStyle}
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#30A8E4',
        }}
      >
        Containers
      </div>
      <div
        className={HeadingStyle}
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#0756AF',
        }}
      >
        Shipments
      </div>
    </>
  );
}

function orderCell({
  itemPosition,
  batchPosition,
  order,
  totalItems,
}: {
  itemPosition: number,
  batchPosition: number,
  order: mixed,
  totalItems: number,
}) {
  if (!itemPosition && !batchPosition)
    return {
      type: 'order',
      data: order,
      afterConnector: 1,
    };

  const isTheLastItemWithFirstBatch = itemPosition === totalItems - 1 && batchPosition === 0;
  const isNotTheLastItem = itemPosition < totalItems - 1 && totalItems > 1;

  if (isTheLastItemWithFirstBatch || isNotTheLastItem)
    return {
      type: 'duplicateOrder',
      data: null,
      afterConnector: 2,
    };
  return null;
}

function containerCell(batch: BatchPayload): ?CellRender {
  if (getByPathWithDefault(null, 'container', batch)) {
    return {
      beforeConnector: 1,
      type: 'container',
      data: getByPathWithDefault(null, 'container', batch),
      afterConnector: 1,
    };
  }

  if (
    getByPathWithDefault(null, 'shipment', batch) &&
    !getByPathWithDefault(null, 'container', batch)
  ) {
    return {
      beforeConnector: 1,
      type: 'shipmentWithoutContainer',
      data: null,
      afterConnector: 1,
    };
  }

  return null;
}

const orderCoordinates = ({
  isExpand,
  isLoadedData,
  order,
}: {
  isExpand: boolean,
  order: mixed,
  isLoadedData?: boolean,
}): Array<?CellRender> => {
  const orderItems = getByPathWithDefault([], 'orderItems', order);
  const orderItemCount = getByPathWithDefault(0, 'orderItemCount', order);
  if (!isExpand) {
    return orderItemCount > 0
      ? [
          {
            type: 'order',
            data: order,
            afterConnector: 1,
          },
          {
            beforeConnector: 1,
            type: 'itemSummary',
            data: order,
            afterConnector: 1,
          },
          {
            beforeConnector: 1,
            type: 'batchSummary',
            data: order,
            afterConnector: 1,
          },
          {
            beforeConnector: 1,
            type: 'containerSummary',
            data: order,
            afterConnector: 1,
          },
          {
            beforeConnector: 1,
            type: 'shipmentSummary',
            data: order,
          },
        ]
      : [
          {
            type: 'order',
            data: order,
          },
          null,
          null,
          null,
          null,
        ];
  }

  const result = [
    null,
    {
      type: 'itemSummary',
      data: order,
      afterConnector: 1,
    },
    {
      beforeConnector: 1,
      type: 'batchSummary',
      data: order,
      afterConnector: 1,
    },
    {
      beforeConnector: 1,
      type: 'containerSummary',
      data: order,
      afterConnector: 1,
    },
    {
      beforeConnector: 1,
      type: 'shipmentSummary',
      data: order,
    },
  ];
  if (!isLoadedData) {
    result.push(
      ...[
        {
          type: 'order',
          data: order,
          afterConnector: 1,
        },
        {
          beforeConnector: 1,
          type: 'placeholder',
          entity: 'orderItem',
          afterConnector: 1,
        },
        {
          beforeConnector: 1,
          type: 'placeholder',
          entity: 'batch',
          afterConnector: 1,
        },
        {
          beforeConnector: 1,
          type: 'placeholder',
          entity: 'container',
          afterConnector: 1,
        },
        {
          beforeConnector: 1,
          type: 'placeholder',
          entity: 'shipment',
          afterConnector: 1,
        },
      ]
    );
    return result;
  }

  if (orderItemCount > 0) {
    orderItems.forEach((item, index) => {
      const batches = getByPathWithDefault([], 'batches', item);
      if (batches.length) {
        batches.forEach((batch, position) => {
          result.push(
            ...[
              orderCell({
                order,
                itemPosition: index,
                batchPosition: position,
                totalItems: orderItems.length,
              }),
              !position
                ? {
                    beforeConnector: 1,
                    type: 'orderItem',
                    data: item,
                    afterConnector: 1,
                  }
                : {
                    type: 'duplicateOrderItem',
                    data: order,
                    afterConnector: 2,
                  },
              {
                beforeConnector: 1,
                type: 'batch',
                data: batch,
                afterConnector: batch && (batch.container || batch.shipment) ? 1 : null,
              },
              containerCell(batch),
              batch && batch.shipment
                ? {
                    beforeConnector: 1,
                    type: 'shipment',
                    data: batch.shipment,
                  }
                : null,
            ]
          );
        });
      } else {
        // order item has no batches
        result.push(
          ...[
            {
              type: 'order',
              data: order,
              afterConnector: 1,
            },
            {
              beforeConnector: 1,
              type: 'orderItem',
              data: item,
            },
            null,
            null,
            null,
          ]
        );
      }
    });
  } else {
    // order which has no item
    result.push(
      ...[
        {
          type: 'order',
          data: order,
        },
        null,
        null,
        null,
        null,
      ]
    );
  }

  return result;
};

const getColorByEntity = (entity: ?Entity) => {
  switch (entity) {
    case 'orderItem':
      return 'ORDER_ITEM';

    default:
      return entity && entity.toUpperCase();
  }
};
const getIconByEntity = (entity: ?Entity) => {
  switch (entity) {
    case 'orderItem':
      return 'ORDER_ITEM';

    default:
      return entity && entity.toUpperCase();
  }
};
const getCardByEntity = (entity: ?Entity) => {
  switch (entity) {
    case 'order':
      return OrderCard;
    case 'orderItem':
      return ItemCard;
    case 'batch':
      return BatchCard;
    case 'container':
      return ContainerCard;
    case 'shipment':
      return ShipmentCard;

    default:
      return React.Fragment;
  }
};

const cellRenderer = (
  cell: ?CellRender,
  {
    onClick,
    isExpand,
  }: {
    onClick: Function,
    isExpand: boolean,
  }
) => {
  if (!cell)
    return (
      <React.Fragment key={uuid()}>
        <div className={ContentStyle} />
        <div className={ContentStyle} />
        <div className={ContentStyle} />
      </React.Fragment>
    );

  const { beforeConnector, type, data, entity, afterConnector } = cell;
  let content = <div className={ContentStyle} />;
  switch (type) {
    case 'placeholder': {
      const color = getColorByEntity(entity);
      const icon = getIconByEntity(entity);
      const PlaceHolder = getCardByEntity(entity);
      content = (
        <div className={ContentStyle}>
          <BaseCard icon={icon} color={color}>
            <PlaceHolder>
              <LoadingIcon />
            </PlaceHolder>
          </BaseCard>
        </div>
      );
      break;
    }
    case 'order':
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="ORDER"
            color="ORDER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <OrderCard>{getByPathWithDefault('', 'poNo', data)}</OrderCard>
          </BaseCard>
        </div>
      );
      break;
    case 'orderItem':
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ItemCard>{getByPathWithDefault('', 'no', data)}</ItemCard>
          </BaseCard>
        </div>
      );
      break;

    case 'batch':
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="BATCH"
            color="BATCH"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <BatchCard>{getByPathWithDefault('', 'no', data)}</BatchCard>
          </BaseCard>
        </div>
      );
      break;

    case 'shipment':
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ShipmentCard>{getByPathWithDefault('', 'blNo', data)}</ShipmentCard>
          </BaseCard>
        </div>
      );
      break;

    case 'shipmentWithoutContainer':
      content = (
        <div className={ContentStyle}>
          <RelationLine type={1} />
        </div>
      );
      break;

    case 'container':
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="CONTAINER"
            color="CONTAINER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ContainerCard>{getByPathWithDefault('', 'no', data)}</ContainerCard>
          </BaseCard>
        </div>
      );
      break;

    case 'itemSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ItemCard>Total: {getByPathWithDefault(0, 'orderItemCount', data)} </ItemCard>
          </BaseCard>
        </div>
      );
      break;

    case 'batchSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <BatchCard>Total: {getByPathWithDefault(0, 'batchCount', data)}</BatchCard>
          </BaseCard>
        </div>
      );
      break;

    case 'containerSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ContainerCard>Total: {getByPathWithDefault(0, 'containerCount', data)}</ContainerCard>
          </BaseCard>
        </div>
      );
      break;

    case 'shipmentSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ShipmentCard>Total {getByPathWithDefault(0, 'shipmentCount', data)}</ShipmentCard>
          </BaseCard>
        </div>
      );
      break;

    default:
      content = <div className={ContentStyle} />;
  }

  return (
    <React.Fragment key={getByPathWithDefault(uuid(), 'id', cell)}>
      <div className={ContentStyle}>
        {beforeConnector && <RelationLine type={beforeConnector} />}
      </div>
      {content}
      <div className={ContentStyle}>{afterConnector && <RelationLine type={afterConnector} />}</div>
    </React.Fragment>
  );
};

function LoadingPlaceHolder({ showHeader }: { showHeader: boolean }) {
  return showHeader ? (
    <div className={WrapperStyle}>
      <Header />
      {[
        {
          type: 'placeholder',
          entity: 'order',
        },
        {
          type: 'placeholder',
          entity: 'orderItem',
        },
        {
          type: 'placeholder',
          entity: 'batch',
        },
        {
          type: 'placeholder',
          entity: 'container',
        },
        {
          type: 'placeholder',
          entity: 'shipment',
        },
      ].map(cell =>
        cellRenderer(cell, {
          onClick: () => {},
          isExpand: false,
        })
      )}
    </div>
  ) : (
    [
      {
        type: 'placeholder',
        entity: 'order',
        data: {
          id: uuid(),
        },
      },
      {
        type: 'placeholder',
        entity: 'orderItem',
        data: {
          id: uuid(),
        },
      },
      {
        type: 'placeholder',
        entity: 'batch',
        data: {
          id: uuid(),
        },
      },
      {
        type: 'placeholder',
        entity: 'container',
        data: {
          id: uuid(),
        },
      },
      {
        type: 'placeholder',
        entity: 'shipment',
        data: {
          id: uuid(),
        },
      },
    ].map(cell =>
      cellRenderer(cell, {
        onClick: () => {},
        isExpand: false,
      })
    )
  );
}

function Row({
  order,
  isExpand,
  onExpand,
  fetchOrder,
}: {
  order: { ...OrderPayload, containerCount: number },
  isExpand: boolean,
  onExpand: Function,
  fetchOrder: (orderId: string) => void,
}) {
  const isLoadedData =
    getByPathWithDefault([], 'orderItems', order).length ===
    getByPathWithDefault(0, 'orderItemCount', order);
  const onClick = React.useCallback(() => {
    if (!isExpand) {
      onExpand(expandIds => [...expandIds, order.id]);
      if (!isLoadedData && order.id) fetchOrder(order.id);
    } else {
      onExpand(expandIds => expandIds.filter(id => id !== order.id));
    }
  }, [fetchOrder, isExpand, isLoadedData, onExpand, order.id]);

  const cells = orderCoordinates({ isExpand, order, isLoadedData });
  return cells.map(cell => cellRenderer(cell, { onClick, isExpand }));
}

const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

const initialState = {
  order: {},
};

function reducer(
  state,
  action: {
    type: 'FETCH_ORDER',
    payload: mixed,
  }
) {
  switch (action.type) {
    case 'FETCH_ORDER':
      return update(state, {
        order: {
          $merge: action.payload,
        },
      });
    default:
      return state;
  }
}

export default function OrderFocus() {
  const [expandRows, setExpandRows] = React.useState([]);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const queryOrderDetail = React.useCallback((orderId: string) => {
    apolloClient
      .query({
        query: orderFocusDetailQuery,
        variables: {
          id: orderId,
        },
      })
      .then(result => {
        dispatch({
          type: 'FETCH_ORDER',
          payload: {
            [orderId]: result.data.order,
          },
        });
      });
  }, []);

  const { queryVariables: queryOrderVariables } = useFilter(
    {
      page: 1,
      perPage: 10,
      filter: {
        query: '',
        archived: false,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    },
    'orderFocusedFilter'
  );
  const scrollParentRef = React.createRef();

  return (
    <div className={ScrollWrapperStyle} ref={scrollParentRef}>
      <Query
        query={orderFocusedListQuery}
        variables={queryOrderVariables}
        fetchPolicy="network-only"
      >
        {({ loading, data, error, fetchMore }) => {
          if (error) {
            return error.message;
          }

          if (loading) {
            return <LoadingPlaceHolder showHeader />;
          }

          const orders = getByPathWithDefault([], 'orders.nodes', data);
          return (
            <InfiniteScroll
              className={WrapperStyle}
              loadMore={() => loadMore({ fetchMore, data }, queryOrderVariables, 'orders')}
              hasMore={hasMoreItems(data, 'orders')}
              loader={<LoadingPlaceHolder key="loading" showHeader={false} />}
              useWindow={false}
              getScrollParent={() => scrollParentRef.current}
            >
              <Header />
              {orders.map(order => (
                <Row
                  order={state.order[order.id] ? { ...order, ...state.order[order.id] } : order}
                  key={order.id}
                  isExpand={expandRows.includes(order.id)}
                  onExpand={setExpandRows}
                  fetchOrder={queryOrderDetail}
                />
              ))}
              {orders.length === 0 && (
                <Display>
                  <FormattedMessage
                    id="modules.Orders.noOrderFound"
                    defaultMessage="No orders found"
                  />
                </Display>
              )}
            </InfiniteScroll>
          );
        }}
      </Query>
    </div>
  );
}
