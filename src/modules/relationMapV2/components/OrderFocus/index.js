// @flow
import * as React from 'react';
import type { OrderPayload, BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { VariableSizeList as List } from 'react-window';
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
import { WrapperStyle, ListStyle, HeadingStyle, ContentStyle, RowStyle } from './style';

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

const TOTAL_COLUMNS = 5;
const ORDER_WIDTH = 305;
const ORDER_ITEM_WIDTH = 485;
const BATCH_WIDTH = 465;
const CONTAINER_WIDTH = 395;
const SHIPMENT_WIDTH = 535;

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

const Header = React.memo(({ style }: { style?: Object }) => {
  return (
    <div style={style} className={RowStyle}>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#ED5724',
          width: ORDER_WIDTH,
        }}
      >
        Orders
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#FBAA1D',
          width: ORDER_ITEM_WIDTH,
        }}
      >
        Items
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#12B937',
          width: BATCH_WIDTH,
        }}
      >
        Batches
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#30A8E4',
          width: CONTAINER_WIDTH,
        }}
      >
        Containers
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#0756AF',
          width: SHIPMENT_WIDTH,
        }}
      >
        Shipments
      </div>
    </div>
  );
});

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
  if (itemPosition === 0 && batchPosition === 0)
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

const orderCoordinates = memoize(
  ({
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
              index === 0
                ? {
                    type: 'order',
                    data: order,
                    afterConnector: 1,
                  }
                : {
                    type: 'duplicateOrder',
                    data: null,
                    afterConnector: 2,
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
  }
);

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
      <div
        style={{
          display: 'flex',
          width: ORDER_WIDTH,
        }}
        key={uuid()}
      >
        <div className={ContentStyle} />
        <div className={ContentStyle} />
        <div className={ContentStyle} />
      </div>
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
        <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
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

    case 'duplicateOrder':
      content = (
        <div
          style={{
            width: ORDER_WIDTH - 10,
          }}
          className={ContentStyle}
        >
          {type}{' '}
        </div>
      );
      break;
    case 'duplicateOrderItem':
      content = (
        <div
          style={{
            width: ORDER_ITEM_WIDTH - 20,
          }}
          className={ContentStyle}
        >
          {type}{' '}
        </div>
      );
      break;

    default:
      content = <div className={ContentStyle}>{type} </div>;
  }

  return (
    <div
      style={{
        display: 'flex',
      }}
      key={`${getByPathWithDefault(uuid(), 'data.id', cell)}-${type}`}
    >
      <div className={ContentStyle}>
        {beforeConnector && <RelationLine type={beforeConnector} />}
      </div>
      {content}
      <div className={ContentStyle}>{afterConnector && <RelationLine type={afterConnector} />}</div>
    </div>
  );
};

const LoadingPlaceHolder = React.memo(() => {
  return (
    <div className={RowStyle} style={{ overflow: 'hidden', height: window.innerHeight - 120 }}>
      {[
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
      )}
    </div>
  );
});

const generateCells = memoize(
  ({
    order,
    isExpand,
    onExpand,
    fetchOrder,
  }: {
    order: Object,
    isExpand: boolean,
    onExpand: Function,
    fetchOrder: (orderId: string) => void,
  }) => {
    const isLoadedData =
      getByPathWithDefault([], 'orderItems', order).length ===
      getByPathWithDefault(0, 'orderItemCount', order);
    const onClick = () => {
      if (!isExpand) {
        onExpand(expandIds => [...expandIds, order.id]);
        if (!isLoadedData && order.id) fetchOrder(order.id);
      } else {
        onExpand(expandIds => expandIds.filter(id => id !== order.id));
      }
    };

    const cells = orderCoordinates({ isExpand, order, isLoadedData });
    return { cells, onClick, isExpand };
  }
);

const generateListData = memoize(
  ({
    orders,
    state,
    expandRows,
    setExpandRows,
    queryOrderDetail,
  }: {
    state: {
      order: Object,
    },
    orders: Array<{ ...OrderPayload, containerCount: number }>,
    expandRows: Array<string>,
    setExpandRows: Function,
    queryOrderDetail: Function,
  }) => {
    const ordersData = orders.map(order =>
      state.order[order.id]
        ? {
            ...order,
            ...state.order[order.id],
          }
        : order
    );

    const result = [
      [
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
        },
      ],
    ]; // empty 1st cell for header

    ordersData.forEach(order => {
      const { cells, onClick, isExpand } = generateCells({
        order,
        isExpand: expandRows.includes(order.id),
        onExpand: setExpandRows,
        fetchOrder: queryOrderDetail,
      });
      let counter = 0;
      let row = [];
      cells.forEach(cell => {
        counter += 1;
        row.push({
          cell,
          onClick,
          isExpand,
        });
        if (counter % TOTAL_COLUMNS === 0) {
          result.push(row);
          row = [];
        }
      });
    });

    return result;
  }
);

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

const Cell = React.memo(
  ({
    index,
    style,
    data,
  }: {
    index: number,
    style: Object,
    data: Array<Array<{
        cell: ?CellRender,
        onClick: Function,
        isExpand: boolean,
      }>>,
  }) => {
    const cells = data[index];
    return (
      <div className={RowStyle} style={style}>
        {cells.map(({ cell, onClick, isExpand }) =>
          cellRenderer(cell, {
            onClick,
            isExpand,
            style,
          })
        )}
      </div>
    );
  }
);

const innerElementType = React.forwardRef(
  ({ children, ...rest }: { children: React.Node }, ref) => (
    <div ref={ref} {...rest}>
      <Header style={{ top: 0, left: 0, width: '100%', zIndex: 2, position: 'sticky' }} />
      {children}
    </div>
  )
);

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

  return (
    <div className={WrapperStyle}>
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
            return (
              <>
                <Header />
                <LoadingPlaceHolder />
              </>
            );
          }

          const orders = getByPathWithDefault([], 'orders.nodes', data);
          const ordersData = generateListData({
            orders,
            state,
            expandRows,
            setExpandRows,
            queryOrderDetail,
          });
          const rowCount = ordersData.length;
          return orders.length > 0 ? (
            <List
              itemData={ordersData}
              className={ListStyle}
              itemCount={rowCount}
              innerElementType={innerElementType}
              itemSize={() => 75}
              onItemsRendered={({ visibleStopIndex }) => {
                const isLastCell = visibleStopIndex === rowCount - 1;
                if (hasMoreItems(data, 'orders') && isLastCell) {
                  loadMore({ fetchMore, data }, queryOrderVariables, 'orders');
                }
              }}
              height={window.innerHeight - 50}
              width={window.innerWidth - 200}
            >
              {Cell}
            </List>
          ) : (
            <Display>
              <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
            </Display>
          );
        }}
      </Query>
    </div>
  );
}
