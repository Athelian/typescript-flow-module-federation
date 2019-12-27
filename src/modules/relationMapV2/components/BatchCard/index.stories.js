/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import BaseCard from 'components/Cards';
import BatchCard from './index';

storiesOf('RelationMapV2/BatchCard', module).add('with no shipment', () => (
  <BaseCard icon="BATCH" color="BATCH" flattenCornerIcon>
    <BatchCard
      batch={{
        id: '14437',
        updatedAt: '2019-12-24T05:21:39Z',
        createdAt: '2019-12-05T06:41:48Z',
        deliveredAt: '2019-12-10T00:00:00Z',
        expiredAt: null,
        desiredAt: '2019-12-26T00:00:00Z',
        ownedBy: null,
        archived: false,
        no: 'batch no 1',
        quantity: 12,
        producedQuantity: null,
        preShippedQuantity: null,
        shippedQuantity: null,
        postShippedQuantity: null,
        deliveredQuantity: null,
        latestQuantity: 12,
        totalVolume: null,
        tags: [],
        shipment: null,
        container: null,
        todo: 'Object',
        __typename: 'Batch',
      }}
    />
  </BaseCard>
));
