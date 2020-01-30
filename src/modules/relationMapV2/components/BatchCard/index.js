// @flow
import * as React from 'react';
import type { BatchPayload, ContainerPayload, ShipmentPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'utils/date';
import { getLatestDate } from 'utils/shipment';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { useHasPermissions } from 'contexts/Permissions';
import { BATCH_DELETE, BATCH_FORM } from 'modules/permission/constants/batch';
import CardActions from 'modules/relationMapV2/components/CardActions';
import {
  BatchCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndDeliveryWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  QuantityVolumeDesiredWrapperStyle,
  DateWrapperStyle,
  DelayStyle,
  TooltipLabelStyle,
} from './style';

type Props = {|
  batch: BatchPayload,
  container: ContainerPayload,
  shipment: ShipmentPayload,
  onViewForm: Event => void,
  onDeleteBatch: Event => void,
  organizationId: string,
|};

const latestDate = (timelineDate: ?Object) => {
  if (timelineDate?.latestDate) return timelineDate?.latestDate;

  return getLatestDate(timelineDate);
};

export default function BatchCard({
  batch,
  container,
  shipment,
  onViewForm,
  onDeleteBatch,
  organizationId,
}: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(BATCH_FORM);
  const allowToDeleteBatch = hasPermissions(BATCH_DELETE);

  const { no, tags = [], deliveredAt, latestQuantity, totalVolume, desiredAt, todo = {} } = batch;

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewDelivery = true;
  const canViewQuantity = true;
  const canViewVolume = true;
  const canViewDesired = true;
  const canViewTasks = true;

  let desiredAtDiff = 0;
  let deliveredAtDiff = 0;
  let desiredAtDiffMsg = null;
  let deliveredAtDiffMsg = null;

  if (shipment) {
    const latestLoadPortDepartureDate = latestDate(shipment.voyages?.[0]?.departure);
    if (latestLoadPortDepartureDate && deliveredAt) {
      deliveredAtDiff = differenceInCalendarDays(
        new Date(deliveredAt),
        new Date(latestLoadPortDepartureDate)
      );
      deliveredAtDiffMsg = (
        <div>
          <div className={TooltipLabelStyle}>
            <FormattedMessage
              id="components.cards.shipmentLatestLoadPortDeparture"
              defaultMessage="Shipment's Latest Load Port Departure"
            />
          </div>
          <FormattedDate value={latestLoadPortDepartureDate} />

          <div className={TooltipLabelStyle}>
            <FormattedMessage
              id="components.cards.batchDelivery"
              defaultMessage="Batch's Delivery Date"
            />
          </div>
          <FormattedDate value={deliveredAt} />

          <div className={TooltipLabelStyle}>
            <FormattedMessage id="components.cards.difference" defaultMessage="Difference" />
          </div>
          {deliveredAtDiff}
        </div>
      );
    }

    if (container) {
      const { warehouseArrivalActualDate } = container;
      if (warehouseArrivalActualDate && desiredAt) {
        desiredAtDiff = differenceInCalendarDays(
          new Date(desiredAt),
          new Date(warehouseArrivalActualDate)
        );
        desiredAtDiffMsg = (
          <div>
            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="components.cards.containerWarehouseActualArrivalDate"
                defaultMessage="Container's Warehouse Actual Arrival Date"
              />
            </div>
            <FormattedDate value={warehouseArrivalActualDate} />

            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="components.cards.batchDesired"
                defaultMessage="Batch's Desired Date"
              />
            </div>
            <FormattedDate value={desiredAt} />

            <div className={TooltipLabelStyle}>
              <FormattedMessage id="components.cards.difference" defaultMessage="Difference" />
            </div>
            {desiredAtDiff}
          </div>
        );
      }
    } else if (shipment.containers?.length === 0) {
      const warehouseLatestArrivalDate = latestDate(
        shipment.containerGroups?.[0]?.warehouseArrival
      );

      if (warehouseLatestArrivalDate && deliveredAt) {
        desiredAtDiffMsg = (
          <div>
            <FormattedMessage
              id="components.cards.shipmentLatestWarehouseArrivalDate"
              defaultMessage="Shipment's Latest Warehouse Arrival Date"
            />
            <p>
              <FormattedDate value={warehouseLatestArrivalDate} />
            </p>
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
            <p>
              <FormattedDate value={desiredAt} />
            </p>
          </div>
        );
        desiredAtDiff = differenceInCalendarDays(
          new Date(desiredAt),
          new Date(warehouseLatestArrivalDate)
        );
      }
    }
  }

  return (
    <div className={BatchCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo} width="100px">
          {no}
        </Display>

        <div className={TagsAndDeliveryWrapperStyle}>
          {canViewTags ? (
            <div className={TagsWrapperStyle}>
              {tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <Blackout />
          )}

          <Label width="75px">
            <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
          </Label>
          <div className={DateWrapperStyle}>
            {canViewDelivery ? (
              <>
                <Display width="80px">
                  <FormattedDate value={deliveredAt} />
                </Display>
                {deliveredAtDiff !== 0 && deliveredAt && (
                  <Tooltip message={deliveredAtDiffMsg}>
                    <div className={DelayStyle(deliveredAtDiff)}>
                      {deliveredAtDiff > 0 && '+'}
                      <FormattedNumber value={deliveredAtDiff} />
                    </div>
                  </Tooltip>
                )}
              </>
            ) : (
              <Blackout />
            )}
          </div>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={QuantityVolumeDesiredWrapperStyle}>
          <Label width="40px">
            <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
          </Label>
          <Display blackout={!canViewQuantity} width="75px">
            <FormattedNumber value={latestQuantity} />
          </Display>

          <Label width="40px">
            <FormattedMessage id="components.cards.vol" defaultMessage="VOL" />
          </Label>
          <Display blackout={!canViewVolume} width="85px">
            <FormattedNumber value={totalVolume?.value} suffix={totalVolume?.metric} />
          </Display>

          <Label width="75px">
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
          </Label>
          <div className={DateWrapperStyle}>
            {canViewDesired ? (
              <>
                <Display width="80px">
                  <FormattedDate value={deliveredAt} />
                </Display>
                {desiredAtDiff !== 0 && desiredAt && (
                  <Tooltip message={desiredAtDiffMsg}>
                    <div className={DelayStyle(desiredAtDiff)}>
                      {desiredAtDiff > 0 && '+'}
                      <FormattedNumber value={desiredAtDiff} />
                    </div>
                  </Tooltip>
                )}
              </>
            ) : (
              <Blackout />
            )}
          </div>
        </div>

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>

      <CardActions
        actions={[
          allowToViewForm
            ? {
                label: (
                  <FormattedMessage
                    id="modules.RelationMap.cards.viewForm"
                    defaultMessage="View Form"
                  />
                ),
                onClick: onViewForm,
              }
            : null,
          allowToDeleteBatch
            ? {
                label: (
                  <FormattedMessage id="modules.RelationMap.cards.delete" defaultMessage="Delete" />
                ),
                onClick: onDeleteBatch,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
