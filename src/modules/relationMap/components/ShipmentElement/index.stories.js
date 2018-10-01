// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import BaseCard from 'components/Cards';
import {
  ItemWrapperStyle,
  CardWrapperStyle,
} from 'modules/relationMap/components/OrderElement/style';
import WrapperCard from 'modules/relationMap/components/OrderElement/WrapperCard';
import ShipmentActions from 'modules/relationMap/components/ShipmentElement/ShipmentActions';

import ShipmentTimeLine from './index';

storiesOf('RelationMap/ShipmentList', module)
  .add('ShipmentTimeLine', () => {
    const data = {
      id: '33',
      no: '7129AO88JZD',
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
    return (
      <div style={{ width: 400, border: '1px dashed red' }}>
        <ShipmentTimeLine shipment={data} />
      </div>
    );
  })
  .add('Shipment Full data', () => {
    const data = {
      id: '22',
      no: 'XXEP234234',
      transportType: 'Sea',
      cargoReady: {
        approvedAt: '1989-07-25T04:49:47',
        date: '2018-09-10T08:33:10',
        timelineDateRevisions: [],
        __typename: 'TimelineDate',
      },
      voyages: [
        {
          id: '31',
          departurePort: { seaport: null, airport: null, __typename: 'Port' },
          arrivalPort: { seaport: null, airport: null, __typename: 'Port' },
          departure: {
            approvedAt: '1974-07-20T23:43:45',
            date: '2018-09-13T06:06:07',
            timelineDateRevisions: [
              { date: '2018-09-13T03:14:34', __typename: 'TimelineDateRevision' },
            ],
            __typename: 'TimelineDate',
          },
          arrival: {
            approvedAt: '1994-06-02T00:36:26',
            date: '2018-09-14T01:48:15',
            timelineDateRevisions: [
              { date: '2018-09-12T03:08:00', __typename: 'TimelineDateRevision' },
            ],
            __typename: 'TimelineDate',
          },
          __typename: 'Voyage',
        },
        {
          id: '36',
          departurePort: { seaport: null, airport: null, __typename: 'Port' },
          arrivalPort: { seaport: null, airport: null, __typename: 'Port' },
          departure: {
            approvedAt: '1996-05-03T03:43:20',
            date: '2018-09-15T20:39:38',
            timelineDateRevisions: [],
            __typename: 'TimelineDate',
          },
          arrival: {
            approvedAt: '1973-09-18T01:18:36',
            date: '2018-09-18T10:46:19',
            timelineDateRevisions: [
              { date: '2018-09-17T01:38:46', __typename: 'TimelineDateRevision' },
              { date: '2018-09-17T08:23:58', __typename: 'TimelineDateRevision' },
            ],
            __typename: 'TimelineDate',
          },
          __typename: 'Voyage',
        },
        {
          id: '39',
          departurePort: { seaport: null, airport: null, __typename: 'Port' },
          arrivalPort: { seaport: null, airport: null, __typename: 'Port' },
          departure: {
            approvedAt: '1980-05-30T06:34:15',
            date: '2018-09-19T14:05:42',
            timelineDateRevisions: [],
            __typename: 'TimelineDate',
          },
          arrival: {
            approvedAt: '1995-10-21T01:40:07',
            date: '2018-09-22T07:31:04',
            timelineDateRevisions: [
              { date: '2018-09-22T04:56:13', __typename: 'TimelineDateRevision' },
            ],
            __typename: 'TimelineDate',
          },
          __typename: 'Voyage',
        },
      ],
      containerGroups: [
        {
          customClearance: {
            approvedAt: null,
            date: '2018-09-24T11:41:26',
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
            timelineDateRevisions: [
              { date: '2018-09-18T23:36:51', __typename: 'TimelineDateRevision' },
            ],
            __typename: 'TimelineDate',
          },
          __typename: 'ContainerGroup',
        },
      ],
      __typename: 'Shipment',
    };

    return (
      <IntlProvider locale="en" messages={translationMessages.en}>
        <div style={{ display: 'grid', gridRowGap: 10, width: 400, textAlign: 'left' }}>
          <div className={CardWrapperStyle}>
            <ShipmentActions
              label={`ORDER ${data.id}`}
              isChecked
              ordersNo={3}
              batchesNo={9}
              onToggle={() => {}}
            />
          </div>
          <div className={CardWrapperStyle}>
            <BaseCard
              icon="SHIPMENT_ALL"
              color="SHIPMENT_ALL"
              actions={[]}
              wrapperClassName={ItemWrapperStyle(true)}
            >
              <WrapperCard onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => {}}>
                <ShipmentTimeLine shipment={data} />
              </WrapperCard>
            </BaseCard>
          </div>
        </div>
      </IntlProvider>
    );
  });
