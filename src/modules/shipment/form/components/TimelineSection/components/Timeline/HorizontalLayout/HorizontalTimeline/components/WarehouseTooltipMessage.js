// @flow
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { TimelineDate } from 'modules/shipment/form/components/TimelineSection/components/Timeline/components';

import { TooltipTitleStyle, TooltipGirdStyle, TooltipLabelStyle } from '../style';

type Props = {
  containers: Array<Object>,
};

export default function WarehouseIconTooltipMessage({ containers }: Props) {
  return (
    <div>
      <div className={TooltipTitleStyle}>
        <FormattedMessage
          id="components.Shipments.warehouseArrival"
          defaultMessage="WAREHOUSE ARRIVAL"
        />
      </div>
      <div className={TooltipGirdStyle}>
        <div>
          <FormattedMessage id="components.Shipments.containers" defaultMessage="CONTAINERS" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.agreedDateLabel" defaultMessage="AGREED" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.actualDateLabel" defaultMessage="ACTUAL" />
        </div>
        {containers.map(container => (
          <Fragment key={container.id || ''}>
            <div className={TooltipLabelStyle}>{container.no || ''}</div>
            <div>
              <TimelineDate
                color="WHITE"
                timelineDate={{
                  date: container.warehouseArrivalAgreedDate,
                  approvedAt: container.warehouseArrivalAgreedDateApprovedAt,
                  timelineDateRevisions: [],
                }}
              />
            </div>
            <div>
              <TimelineDate
                color="WHITE"
                timelineDate={{
                  date: container.warehouseArrivalActualDate,
                  approvedAt: container.warehouseArrivalActualDateApprovedAt,
                  timelineDateRevisions: [],
                }}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
