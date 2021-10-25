// @flow
import * as React from 'react';
import type {
  BatchPayload,
  ContainerPayload,
  ShipmentPayload,
  // OrderPayload,
  UserPayload,
} from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'utils/date';
import { getLatestDate } from 'utils/shipment';
import Tag from 'components/Tag';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import FormattedDateTZ from 'components/FormattedDateTZ';
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
  // order: OrderPayload,
  onViewForm: Event => void,
  onDeleteBatch: Event => void,
  organizationId: string,
  user: UserPayload,
|};

const latestDate = (timelineDate: ?Object) => {
  if (timelineDate?.latestDate) return timelineDate?.latestDate;

  return getLatestDate(timelineDate);
};

export default function BatchCard({
  batch,
  container,
  shipment,
  // order,
  onViewForm,
  onDeleteBatch,
  organizationId,
  user,
}: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(BATCH_FORM);
  const allowToDeleteBatch = hasPermissions(BATCH_DELETE);

  const {
    no,
    tags = [],
    deliveredAt,
    latestQuantity,
    totalVolume,
    desiredAt,
    todo = {},
    // orderItem: {
    //   order: { incoterm: orderIncoterm },
    // },
  } = batch;

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

  const term = shipment?.incoterm;
  const latestLoadPortDepartureDate = latestDate(shipment?.voyages?.[0]?.departure);
  const cargoReadyLatestDate = latestDate(shipment?.cargoReady);
  const latestWarehouseActualArrival = shipment?.latestWarehouseActualArrival;
  const { warehouseArrivalActualDate, warehouseArrivalAgreedDate } = container || {};

  const determineDateBasedOnIncoterms = () => {
    let date = '';
    if (term === 'FOB' || term === 'CFR' || term === 'CIF' || term === null) {
      date = latestLoadPortDepartureDate;
    }
    if (term === 'EXW' || term === 'FAS' || term === 'FCA' || term === 'CPT' || term === 'CIP') {
      date = cargoReadyLatestDate;
    }
    if (term === 'DDP' || term === 'DAP' || term === 'DAT') {
      if (warehouseArrivalActualDate) {
        date = warehouseArrivalActualDate;
      }
      if (warehouseArrivalAgreedDate) {
        date = warehouseArrivalAgreedDate;
      }
      if (latestWarehouseActualArrival) {
        date = latestWarehouseActualArrival;
      }
    }
    return date;
  };

  const determineHeader = () => {
    let header = '';

    if (term === 'FOB' || term === 'CFR' || term === 'CIF' || term === null) {
      header = (
        <>
          <div className={TooltipLabelStyle}>
            <FormattedMessage
              id="components.cards.shipmentLatestLoadPortDeparture"
              defaultMessage="Shipment's Latest Load Port Departure"
            />
          </div>
          <FormattedDateTZ value={latestLoadPortDepartureDate} user={user} />
        </>
      );
    }
    if (term === 'EXW' || term === 'FAS' || term === 'FCA' || term === 'CPT' || term === 'CIP') {
      header = (
        <>
          <div className={TooltipLabelStyle}>
            <FormattedMessage
              id="modules.Orders.shipment.cargoReady"
              defaultMessage="Cargo Ready"
            />
          </div>
          <FormattedDateTZ value={cargoReadyLatestDate} user={user} />
        </>
      );
    }
    if (term === 'DDP' || term === 'DAP' || term === 'DAT') {
      if (warehouseArrivalActualDate) {
        header = (
          <>
            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="modules.container.warehouseArrivalActualDate"
                defaultMessage="Actual Arrival Date"
              />
            </div>
            <FormattedDateTZ value={warehouseArrivalActualDate} user={user} />
          </>
        );
      }
      if (warehouseArrivalAgreedDate) {
        header = (
          <>
            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="modules.Containers.warehouseArrivalAgreedDate"
                defaultMessage="Agreed Arrival Date"
              />
            </div>
            <FormattedDateTZ value={warehouseArrivalAgreedDate} user={user} />
          </>
        );
      }
      if (
        !warehouseArrivalActualDate &&
        !warehouseArrivalAgreedDate &&
        latestWarehouseActualArrival
      ) {
        header = (
          <>
            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="components.cards.shipmentLatestWarehouseArrivalDate"
                defaultMessage="Shipment's Latest Warehouse Arrival Date"
              />
            </div>
            <FormattedDateTZ value={latestWarehouseActualArrival} user={user} />
          </>
        );
      }
    }
    return header;
  };

  if (shipment) {
    const incotermsExist = determineDateBasedOnIncoterms();
    if (
      (incotermsExist !== null || incotermsExist !== undefined || incotermsExist !== '') &&
      deliveredAt
    ) {
      deliveredAtDiff = differenceInCalendarDays(
        new Date(determineDateBasedOnIncoterms()),
        new Date(deliveredAt)
      );
      deliveredAtDiffMsg = (
        <div>
          {determineHeader()}
          <div className={TooltipLabelStyle}>
            <FormattedMessage
              id="components.cards.batchDelivery"
              defaultMessage="Batch's Delivery Date"
            />
          </div>
          <FormattedDateTZ value={deliveredAt} user={user} />

          <div className={TooltipLabelStyle}>
            <FormattedMessage id="components.cards.difference" defaultMessage="Difference" />
          </div>
          {deliveredAtDiff}
          {term && (
            <div className={TooltipLabelStyle}>
              <FormattedMessage id="modulues.Orders.incoterms" defaultMessage="Incoterms" /> (
              <FormattedMessage id="modulues.Shipments.shipment" defaultMessage="Shipment" />)
            </div>
          )}
          {term && term}
          {/* Only shipment incoterm for now */}
          {/* {shipment?.incoterm && orderIncoterm && `${shipment.incoterm}, ${orderIncoterm}`}
          {shipment?.incoterm && !orderIncoterm && `${shipment.incoterm}`}
          {!shipment?.incoterm && orderIncoterm && `${orderIncoterm}`} */}
        </div>
      );
    }

    if (container) {
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
            <FormattedDateTZ value={warehouseArrivalActualDate} user={user} />

            <div className={TooltipLabelStyle}>
              <FormattedMessage
                id="components.cards.batchDesired"
                defaultMessage="Batch's Desired Date"
              />
            </div>
            <FormattedDateTZ value={desiredAt} user={user} />

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
              <FormattedDateTZ value={warehouseLatestArrivalDate} user={user} />
            </p>
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
            <p>
              <FormattedDateTZ value={desiredAt} user={user} />
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
          <FullValueTooltip message={no}>
            <span>{no}</span>
          </FullValueTooltip>
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
                  <FormattedDateTZ value={deliveredAt} user={user} />
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
                  <FormattedDateTZ value={desiredAt} user={user} />
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
