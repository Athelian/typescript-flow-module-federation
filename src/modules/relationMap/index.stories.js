/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { cx } from 'react-emotion';
import BaseCard from 'components/Cards';
import OrderCard from 'components/RelationMap/OrderElement/OrderCard';
import OrderItemCard from 'components/RelationMap/OrderElement/OrderItemCard';
import RelationLine from 'components/RelationMap/OrderElement/RelationLine';
import BatchCard from 'components/RelationMap/OrderElement/BatchCard';
import ShipmentCard from 'components/RelationMap/ShipmentElement/ShipmentTimeline/TimelineLayout';
import * as ItemStyle from 'components/RelationMap/OrderElement/style';
import { translationMessages } from 'i18n';
import * as Style from './style';
import SummaryBadge from './common/SummaryBadge';

storiesOf('RelationMap/Layout', module)
  .add('SummaryBadge', () => (
    <Style.RelationMapGrid>
      <SummaryBadge icon="ORDER" color="ORDER" label="ORDERS" no={1} />
      <SummaryBadge icon="ORDER_ITEM" color="ORDER_ITEM" label="ITEMS" no={7} />
      <SummaryBadge icon="BATCH" color="BATCH" label="BATCHES" no={9} />
      <SummaryBadge icon="SHIPMENT" color="SHIPMENT" label="SHIPMENTS" no={5} />
    </Style.RelationMapGrid>
  ))
  .add('Shipment Focused', () => {
    const shipment = {
      transportType: 'Air',
      cargoReady: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [
          {
            date: '2018-01-02',
          },
          {
            date: '2018-11-12',
          },
        ],
      },
      voyages: [
        {
          id: '1',
          departurePort: 'ADALV',
          arrivalPort: 'HNGAC',
          departure: {
            approvedAt: true,
            date: '2018-11-01',
            timelineDateRevisions: [],
          },
          arrival: {
            approvedAt: true,
            date: '2018-11-01',
            timelineDateRevisions: [],
          },
        },
        {
          id: '2',
          departurePort: 'HNGAC',
          arrivalPort: null,
          departure: {
            approvedAt: true,
            date: null,
            timelineDateRevisions: [],
          },
          arrival: {
            approvedAt: false,
            date: '2018-11-01',
            timelineDateRevisions: [],
          },
        },
        {
          id: '3',
          departurePort: 'HAN',
          arrivalPort: null,
          departure: {
            approvedAt: false,
            date: null,
            timelineDateRevisions: [],
          },
          arrival: {
            approvedAt: false,
            date: '2018-11-02',
            timelineDateRevisions: [],
          },
        },
      ],
      containerGroups: [
        {
          customClearance: {
            approvedAt: false,
            date: '2018-11-01',
            timelineDateRevisions: [],
          },
          warehouseArrival: {
            approvedAt: false,
            date: null,
            timelineDateRevisions: [],
          },
          deliveryReady: {
            approvedAt: false,
            date: '2018-11-01',
            timelineDateRevisions: [],
          },
        },
      ],
    };
    const data = {
      poNo: 'po32423432 1',
      orderedQuantity: 100,
      batchedQuantity: 20,
      shippedQuantity: 30,
    };
    const items = [];
    for (let index = 0; index < 10; index += 1) {
      const key = `item-${index}`;
      items.push(
        <BaseCard
          key={key}
          icon="ORDER"
          color="ORDER"
          actions={[]}
          wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
        >
          <OrderCard
            info={data.poNo}
            orderedQuantity={data.orderedQuantity}
            batchedQuantity={data.batchedQuantity}
            shippedQuantity={data.shippedQuantity}
          />
        </BaseCard>
      );
    }
    return (
      <IntlProvider locale="en" messages={translationMessages.en}>
        <Style.RelationMapGrid>
          <div className={Style.ScrollWrapperStyle}>{items}</div>
          <div className={Style.MapWrapperStyle}>
            <BaseCard
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <OrderItemCard
                info="data.poNo"
                orderedQuantity={200}
                batchedQuantity={50}
                shippedQuantity={80}
              />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="BATCH"
              color="BATCH"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <BatchCard title="Batch 00123" quantity={1000} volume={40} />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="SHIPMENT"
              color="SHIPMENT"
              actions={[]}
              wrapperClassName={cx(ItemStyle.ItemWrapperStyle(false), ItemStyle.ShipmentCardStyle)}
            >
              <ShipmentCard shipment={shipment} />
            </BaseCard>
            <BaseCard
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <OrderItemCard
                info="data.poNo"
                orderedQuantity={200}
                batchedQuantity={50}
                shippedQuantity={80}
              />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="BATCH"
              color="BATCH"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <BatchCard title="Batch 00123" quantity={1000} volume={40} />
            </BaseCard>
            <div />
            <BaseCard
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <OrderItemCard
                info="data.poNo"
                orderedQuantity={200}
                batchedQuantity={50}
                shippedQuantity={80}
              />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="BATCH"
              color="BATCH"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <BatchCard title="Batch 00123" quantity={1000} volume={40} />
            </BaseCard>
            <div />
            <BaseCard
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <OrderItemCard
                info="data.poNo"
                orderedQuantity={200}
                batchedQuantity={50}
                shippedQuantity={80}
              />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              actions={[]}
              wrapperClassName={ItemStyle.ItemWrapperStyle(false)}
            >
              <OrderItemCard
                info="data.poNo"
                orderedQuantity={200}
                batchedQuantity={50}
                shippedQuantity={80}
              />
            </BaseCard>
            <RelationLine type={0} isFocus={false} />
            <BaseCard
              icon="SHIPMENT"
              color="SHIPMENT"
              actions={[]}
              wrapperClassName={cx(ItemStyle.ItemWrapperStyle(false), ItemStyle.ShipmentCardStyle)}
            >
              <ShipmentCard shipment={shipment} />
            </BaseCard>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
            <div>x</div>
          </div>
        </Style.RelationMapGrid>
      </IntlProvider>
    );
  });
