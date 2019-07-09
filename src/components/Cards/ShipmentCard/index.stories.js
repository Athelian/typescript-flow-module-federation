/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import faker from 'faker';
import Shipment from './index';

const shipment = {
  id: faker.random.uuid(),
  archived: false,
  no: faker.name.findName(),
  blNo: '',
  booked: false,
  transportType: null,
  batchCount: 4,
  orderItemCount: 3,
  totalVolume: {
    value: 0.0,
    metric: 'm³',
    __typename: 'MetricValue',
  },
  containerTypeCounts: [
    {
      containerType: '42G1',
      count: 1.0,
      __typename: 'ContainerTypeCount',
    },
  ],
  importer: {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    __typename: 'Group',
  },
  exporter: {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    __typename: 'Group',
  },
  cargoReady: {
    id: faker.random.uuid(),
    date: null,
    approvedAt: null,
    timelineDateRevisions: [],
    __typename: 'TimelineDate',
  },
  tags: [
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      color: '#cbea7c',
      __typename: 'Tag',
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      color: '#dec1c7',
      __typename: 'Tag',
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      color: '#272669',
      __typename: 'Tag',
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      color: '#01c767',
      __typename: 'Tag',
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      color: '#58383d',
      __typename: 'Tag',
    },
  ],
  todo: {
    taskCount: {
      count: 6,
      remain: 6,
      inProgress: 0,
      completed: 0,
      rejected: 0,
      approved: 0,
      skipped: 0,
      delayed: 0,
      __typename: 'TaskCount',
    },
    __typename: 'Todo',
  },
  inCharges: [
    {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Group',
      },
      __typename: 'User',
    },
    {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Group',
      },
      __typename: 'User',
    },
    {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Group',
      },
      __typename: 'User',
    },
    {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Group',
      },
      __typename: 'User',
    },
    {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Group',
      },
      __typename: 'User',
    },
  ],
  voyages: [
    {
      id: faker.random.uuid(),
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
        id: faker.random.uuid(),
        date: null,
        approvedAt: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      arrival: {
        id: faker.random.uuid(),
        date: null,
        approvedAt: '2019-06-18T05:57:07Z',
        approvedBy: {
          id: faker.random.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      vesselName: null,
      __typename: 'Voyage',
    },
  ],
  containerGroups: [
    {
      id: faker.random.uuid(),
      customClearance: {
        id: faker.random.uuid(),
        date: null,
        approvedAt: '2019-06-18T05:57:15Z',
        approvedBy: {
          id: faker.random.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        timelineDateRevisions: [
          {
            id: faker.random.uuid(),
            date: '2019-06-12T00:00:00Z',
            __typename: 'TimelineDateRevision',
          },
        ],
        __typename: 'TimelineDate',
      },
      warehouseArrival: {
        id: faker.random.uuid(),
        date: null,
        approvedAt: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      deliveryReady: {
        id: faker.random.uuid(),
        date: null,
        approvedAt: null,
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      warehouse: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Warehouse',
      },
      __typename: 'ContainerGroup',
    },
  ],
  containers: [
    {
      id: faker.random.uuid(),
      warehouseArrivalAgreedDate: null,
      warehouseArrivalAgreedDateApprovedAt: null,
      warehouseArrivalActualDate: null,
      warehouseArrivalActualDateApprovedAt: null,
      warehouse: {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        __typename: 'Warehouse',
      },
      __typename: 'Container',
    },
  ],
  batches: [
    {
      id: faker.random.uuid(),
      __typename: 'Batch',
    },
    {
      id: faker.random.uuid(),
      __typename: 'Batch',
    },
    {
      id: faker.random.uuid(),
      __typename: 'Batch',
    },
    {
      id: faker.random.uuid(),
      __typename: 'Batch',
    },
  ],
  __typename: 'Shipment',
  ownedBy: {
    id: faker.random.uuid(),
    partner: null,
    name: faker.name.findName(),
    __typename: 'Group',
  },
};

storiesOf('Card/Shipment', module)
  .add('with blackout', () => <Shipment />)
  .add('with shipment and no actions', () => <Shipment shipment={shipment} />)
  .add('with 2 voyages', () => (
    <Shipment
      shipment={{
        ...shipment,
        voyages: [
          {
            id: faker.random.uuid(),
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
              id: faker.random.uuid(),
              date: null,
              approvedAt: null,
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            arrival: {
              id: faker.random.uuid(),
              date: null,
              approvedAt: '2019-06-18T05:57:07Z',
              approvedBy: {
                id: faker.random.uuid(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              },
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            vesselName: null,
            __typename: 'Voyage',
          },
          {
            id: faker.random.uuid(),
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
              id: faker.random.uuid(),
              date: null,
              approvedAt: null,
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            arrival: {
              id: faker.random.uuid(),
              date: null,
              approvedAt: '2019-06-18T05:57:07Z',
              approvedBy: {
                id: faker.random.uuid(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              },
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            vesselName: null,
            __typename: 'Voyage',
          },
        ],
      }}
    />
  ))
  .add('with 3 voyages', () => (
    <Shipment
      shipment={{
        ...shipment,
        voyages: [
          {
            id: faker.random.uuid(),
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
              id: faker.random.uuid(),
              date: null,
              approvedAt: null,
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            arrival: {
              id: faker.random.uuid(),
              date: null,
              approvedAt: '2019-06-18T05:57:07Z',
              approvedBy: {
                id: faker.random.uuid(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              },
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            vesselName: null,
            __typename: 'Voyage',
          },
          {
            id: faker.random.uuid(),
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
              id: faker.random.uuid(),
              date: null,
              approvedAt: null,
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            arrival: {
              id: faker.random.uuid(),
              date: null,
              approvedAt: '2019-06-18T05:57:07Z',
              approvedBy: {
                id: faker.random.uuid(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              },
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            vesselName: null,
            __typename: 'Voyage',
          },
          {
            id: faker.random.uuid(),
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
              id: faker.random.uuid(),
              date: null,
              approvedAt: null,
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            arrival: {
              id: faker.random.uuid(),
              date: null,
              approvedAt: '2019-06-18T05:57:07Z',
              approvedBy: {
                id: faker.random.uuid(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
              },
              timelineDateRevisions: [],
              __typename: 'TimelineDate',
            },
            vesselName: null,
            __typename: 'Voyage',
          },
        ],
      }}
    />
  ));
