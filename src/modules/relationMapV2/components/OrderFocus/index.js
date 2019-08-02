// @flow
import * as React from 'react';
import type { OrderPayload, BatchPayload } from 'generated/graphql';
import { range, random } from 'lodash';
import styled from 'react-emotion';
import { getByPathWithDefault } from 'utils/fp';
import BaseCard from 'components/Cards';
import {
  orderGenerator,
  orderItemGenerator,
  batchGenerator,
  containerGenerator,
  shipmentGenerator,
} from 'modules/relationMapV2/helpers';
import RelationLine from '../RelationLine';

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
    | 'shipmentSummary',
  data: mixed,
  beforeConnector?: ?number,
  afterConnector?: ?number,
};

const Wrapper = styled.div`
  display: grid;
  width: 100%;
  overflow: auto;
  grid-template-columns: repeat(15, min-content);
  grid-template-rows: auto;
`;
const Heading = styled.div`
  padding: 20px;
  color: #fff;
`;

const Content = styled.div`
  margin: 10px 0;
  min-width: 10px;
`;

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

/**
 *  Generate the data for x/y with position
 * @param boolean isExpand
 * @param OrderPayload order
 */
const orderCoordinates = (
  isExpand: boolean,
  order: { ...OrderPayload, containerCount: number }
): Array<?CellRender> => {
  const orderItems = getByPathWithDefault([], 'orderItems', order);
  if (!isExpand) {
    return orderItems.length
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

  const result = orderItems.length
    ? [
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
      ]
    : [null, null, null, null, null];

  if (orderItems.length) {
    orderItems.forEach((item, index) => {
      const batches = getByPathWithDefault([], 'batches', item);
      if (batches.length) {
        batches.forEach((batch, position) => {
          result.push(
            ...[
              !index && !position
                ? {
                    type: 'order',
                    data: order,
                    afterConnector: 1,
                  }
                : {
                    type: 'duplicateOrder',
                    data: order,
                    afterConnector: 2,
                  },
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
      <>
        <Content />
        <Content />
        <Content />
      </>
    );

  const { beforeConnector, type, data, afterConnector } = cell;
  let content = <Content />;
  switch (type) {
    case 'order':
      content = (
        <Content>
          <BaseCard
            icon="ORDER"
            color="ORDER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <OrderCard>{getByPathWithDefault('', 'poNo', data)}</OrderCard>
          </BaseCard>
        </Content>
      );
      break;
    case 'orderItem':
      content = (
        <Content>
          <BaseCard
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ItemCard>{getByPathWithDefault('', 'productProvider.product.name', data)}</ItemCard>
          </BaseCard>
        </Content>
      );
      break;

    case 'batch':
      content = (
        <Content>
          <BaseCard
            icon="BATCH"
            color="BATCH"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <BatchCard>{getByPathWithDefault('', 'no', data)}</BatchCard>
          </BaseCard>
        </Content>
      );
      break;

    case 'shipment':
      content = (
        <Content>
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ShipmentCard>{getByPathWithDefault('', 'no', data)}</ShipmentCard>
          </BaseCard>
        </Content>
      );
      break;

    case 'shipmentWithoutContainer':
      content = (
        <Content>
          <RelationLine type={1} />
        </Content>
      );
      break;

    case 'container':
      content = (
        <Content>
          <BaseCard
            icon="CONTAINER"
            color="CONTAINER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
          >
            <ContainerCard>{getByPathWithDefault('', 'no', data)}</ContainerCard>
          </BaseCard>
        </Content>
      );
      break;

    case 'itemSummary':
      content = (
        <Content onClick={onClick}>
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
        </Content>
      );
      break;

    case 'batchSummary':
      content = (
        <Content onClick={onClick}>
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
        </Content>
      );
      break;

    case 'containerSummary':
      content = (
        <Content onClick={onClick}>
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
        </Content>
      );
      break;

    case 'shipmentSummary':
      content = (
        <Content onClick={onClick}>
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
        </Content>
      );
      break;

    default:
      content = <Content />;
  }

  return (
    <>
      <Content>{beforeConnector && <RelationLine type={beforeConnector} />}</Content>
      {content}
      <Content>{afterConnector && <RelationLine type={afterConnector} />}</Content>
    </>
  );
};

function Row({
  order,
  isExpand,
  onExpand,
}: {
  order: { ...OrderPayload, containerCount: number },
  isExpand: boolean,
  onExpand: Function,
}) {
  const onClick = React.useCallback(() => {
    if (!isExpand) {
      onExpand(expandIds => [...expandIds, order.id]);
    } else {
      onExpand(expandIds => expandIds.filter(id => id !== order.id));
    }
  }, [isExpand, onExpand, order.id]);

  const cells = orderCoordinates(isExpand, order);

  return cells.map(cell => cellRenderer(cell, { onClick, isExpand }));
}

const dummyData = (): Array<{ ...OrderPayload, containerCount: number }> => {
  return range(20).map(() => {
    const order = orderGenerator();
    const shipment = shipmentGenerator();
    // $FlowIgnore simulate test data
    return {
      ...order,
      // $FlowIgnore simulate test data
      orderItems: range(0, random(3)).map(() => ({
        ...orderItemGenerator(),
        batches: range(0, random(5)).map(() => {
          const hasContainer = random(1);
          return {
            ...batchGenerator(),
            container: hasContainer
              ? {
                  ...containerGenerator(),
                  shipment,
                }
              : null,
            shipment: hasContainer || random(1) ? shipment : null,
          };
        }),
      })),
      shipments: [shipment],
    };
  });
};

const orders = dummyData();
export default function OrderFocus() {
  const [expandRows, setExpandRows] = React.useState([]);

  return (
    <Wrapper>
      <Heading
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#ED5724',
        }}
      >
        Orders
      </Heading>
      <Heading
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#FBAA1D',
        }}
      >
        Items
      </Heading>
      <Heading
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#12B937',
        }}
      >
        Batches
      </Heading>
      <Heading
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#30A8E4',
        }}
      >
        Containers
      </Heading>
      <Heading
        style={{
          gridColumn: 'span 3',
          backgroundColor: '#0756AF',
        }}
      >
        Shipments
      </Heading>
      {orders.map(order => (
        <Row
          // $FlowIgnore simulate test data
          order={order}
          key={order.id}
          isExpand={expandRows.includes(order.id)}
          onExpand={setExpandRows}
        />
      ))}
    </Wrapper>
  );
}
