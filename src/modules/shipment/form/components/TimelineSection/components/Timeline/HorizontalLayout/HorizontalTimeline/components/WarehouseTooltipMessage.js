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
          <FormattedMessage id="components.Shipments.type" defaultMessage="TYPE" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.warehouse" defaultMessage="WAREHOUSE" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.freeTime" defaultMessage="FREE TIME" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.agreedDateLabel" defaultMessage="AGREED" />
        </div>
        <div>
          <FormattedMessage id="components.Shipments.actualDateLabel" defaultMessage="ACTUAL" />
        </div>
        {containers.map(container => (
          <Fragment key={container.id}>
            <div className={TooltipLabelStyle('left')}>{container.no}</div>
            <div className={TooltipLabelStyle()}>{container.containerType}</div>
            <div className={TooltipLabelStyle()}>{container.warehouse?.name} </div>
            {/* TODO: https://app.asana.com/0/1128234177716832/1139582947078153 */}
            <div className={TooltipLabelStyle()} />
            <div>
              <TimelineDate
                color="WHITE"
                mode="datetime"
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
                mode="datetime"
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
