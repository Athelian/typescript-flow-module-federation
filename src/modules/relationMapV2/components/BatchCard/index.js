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
  DelayStyle,
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

  // TODO: calculate the diff
  let desiredAtDiff = 0;
  let deliveredAtDiff = 0;
  let desiredAtDiffMsg = null;
  let deliveredAtDiffMsg = null;

  if (shipment) {
    const lastPortDepartureDate = latestDate(
      shipment?.voyages?.[shipment?.voyages?.length - 1]?.departure
    );
    if (lastPortDepartureDate && deliveredAt) {
      deliveredAtDiffMsg = (
        <div>
          <FormattedMessage
            id="components.cards.shipmentLatestLoadPortDeparture"
            defaultMessage="Shipment's Latest Load Port Departure"
          />
          <p>
            <FormattedDate value={lastPortDepartureDate} />
          </p>
          <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
          <p>
            <FormattedDate value={deliveredAt} />
          </p>
        </div>
      );
      deliveredAtDiff = differenceInCalendarDays(
        new Date(deliveredAt),
        new Date(lastPortDepartureDate)
      );
    }

    if (container) {
      const { warehouseArrivalActualDate } = container;
      if (warehouseArrivalActualDate && desiredAt) {
        desiredAtDiffMsg = (
          <div>
            <FormattedMessage
              id="components.cards.containerWarehouseActualArrivalDate"
              defaultMessage="Container's Warehouse Actual Arrival Date"
            />
            <p>
              <FormattedDate value={warehouseArrivalActualDate} />
            </p>
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
            <p>
              <FormattedDate value={desiredAt} />
            </p>
          </div>
        );
        desiredAtDiff = differenceInCalendarDays(
          new Date(desiredAt),
          new Date(warehouseArrivalActualDate)
        );
      }
    } else if (shipment.containers.length === 0) {
      const warehouseLatestArrivalDate = latestDate(
        shipment?.containerGroups?.[0]?.warehouseArrival
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
          <Display blackout={!canViewDelivery} width="85px">
            <FormattedDate value={deliveredAt} />
            {deliveredAtDiff !== 0 && deliveredAt && (
              <Tooltip message={deliveredAtDiffMsg}>
                <div className={DelayStyle(deliveredAtDiff, 1)}>
                  {deliveredAtDiff > 0 ? '+' : ' '}
                  <FormattedNumber value={deliveredAtDiff} />
                </div>
              </Tooltip>
            )}
          </Display>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={QuantityVolumeDesiredWrapperStyle}>
          <Label width="40px">
            <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
          </Label>
          <Display blackout={!canViewQuantity} width="85px">
            <FormattedNumber value={latestQuantity} />
          </Display>

          <Label width="49px">
            <FormattedMessage id="components.cards.vol" defaultMessage="VOL" />
          </Label>
          <Display blackout={!canViewVolume} width="95px">
            <FormattedNumber value={totalVolume?.value} suffix={totalVolume?.metric} />
          </Display>

          <Label width="75px">
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
          </Label>
          <Display blackout={!canViewDesired} width="85px">
            <FormattedDate value={desiredAt} />
            {desiredAtDiff !== 0 && desiredAt && (
              <Tooltip message={desiredAtDiffMsg}>
                <div className={DelayStyle(desiredAtDiff, 2)}>
                  {desiredAtDiff > 0 ? '+' : ' '}
                  <FormattedNumber value={desiredAtDiff} />
                </div>
              </Tooltip>
            )}
          </Display>
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
