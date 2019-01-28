/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TimelineWarehouseContainerIcon from './index';

const containerNoApproved = {};

const containerAllApproved = {
  warehouseArrivalAgreedDateApprovedBy: 'User',
  warehouseArrivalActualDateApprovedBy: 'User',
};
const containerAgreedDateApproved = {
  warehouseArrivalAgreedDateApprovedBy: 'User',
};
const containerActualDateApproved = {
  warehouseArrivalActualDateApprovedBy: 'User',
};
storiesOf('Timeline', module).add('TimelineWarehouseContainerIcon', () => (
  <div>
    <div>
      <div>All approved</div>
      <TimelineWarehouseContainerIcon
        containers={[containerAllApproved, containerAllApproved, containerAllApproved]}
      />
    </div>
    <div>
      <div>no approved</div>
      <TimelineWarehouseContainerIcon
        containers={[containerNoApproved, containerNoApproved, containerNoApproved]}
      />
    </div>
    <div>
      <div>one container no aggreedDate</div>
      <TimelineWarehouseContainerIcon containers={[containerActualDateApproved]} />
    </div>
    <div>
      <div>two container (one is not agreed)</div>
      <TimelineWarehouseContainerIcon
        containers={[containerAllApproved, containerActualDateApproved]}
      />
    </div>
    <div>
      <div>two container (one agreed, one actual)</div>
      <TimelineWarehouseContainerIcon
        containers={[containerAgreedDateApproved, containerActualDateApproved]}
      />
    </div>

    <div>
      <div>three container (one is not agreed)</div>
      <TimelineWarehouseContainerIcon
        containers={[containerAllApproved, containerAllApproved, containerActualDateApproved]}
      />
    </div>

    <div>
      <div>three container (one agreed, one actual)</div>
      <TimelineWarehouseContainerIcon
        containers={[containerNoApproved, containerAgreedDateApproved, containerActualDateApproved]}
      />
    </div>
    <div>
      <div>three container (one agreed, two actual)</div>
      <TimelineWarehouseContainerIcon
        containers={[
          containerActualDateApproved,
          containerAgreedDateApproved,
          containerActualDateApproved,
        ]}
      />
    </div>
    <div>
      <div>all agreed (not actual)</div>
      <TimelineWarehouseContainerIcon
        containers={[
          containerAgreedDateApproved,
          containerAgreedDateApproved,
          containerAgreedDateApproved,
        ]}
      />
    </div>
  </div>
));
