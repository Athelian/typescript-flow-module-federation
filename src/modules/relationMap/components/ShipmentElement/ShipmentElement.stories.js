/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ShipmentTimeLine from './index';

const data = {
  id: '33',
  transportType: null,
  cargoReady: {
    approvedAt: null,
    date: null,
    timelineDateRevisions: [],
    __typename: 'TimelineDate',
  },
  voyages: [
    {
      id: '48',
      departurePort: {
        seaport: null,
        airport: null,
        __typename: 'Port',
      },
      arrivalPort: {
        seaport: null,
        airport: null,
        __typename: 'Port',
      },
      departure: {
        approvedAt: null,
        date: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      arrival: {
        approvedAt: null,
        date: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      __typename: 'Voyage',
    },
  ],
  containerGroups: [
    {
      customClearance: {
        approvedAt: null,
        date: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      warehouseArrival: {
        approvedAt: null,
        date: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      deliveryReady: {
        approvedAt: null,
        date: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      __typename: 'ContainerGroup',
    },
  ],
  __typename: 'Shipment',
};

storiesOf('RelationMap/ShipmentList', module).add('ShipmentTimeLine', () => (
  <div style={{ width: 400, border: '1px dashed red' }}>
    <ShipmentTimeLine shipment={data} />
  </div>
));
