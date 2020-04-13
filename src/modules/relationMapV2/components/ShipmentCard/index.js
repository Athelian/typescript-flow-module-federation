// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import { Display, Blackout, Label } from 'components/Form';
import { FocusedView, GlobalShipmentPoint } from 'modules/relationMapV2/store';
import { useHasPermissions } from 'contexts/Permissions';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { getAgreedArrivalDates, getActualArrivalDates } from 'modules/shipment/helpers';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import { getPort } from 'utils/shipment';
import { earliest, latest, differenceInCalendarDays } from 'utils/date';
import MiniShipmentTimeline from 'modules/relationMapV2/components/MiniShipmentTimeline';
import CardActions from 'modules/relationMapV2/components/CardActions';
import {
  CARGO_READY,
  LOAD_PORT_DEPARTURE,
  FIRST_TRANSIT_PORT_ARRIVAL,
  FIRST_TRANSIT_PORT_DEPARTURE,
  SECOND_TRANSIT_PORT_ARRIVAL,
  SECOND_TRANSIT_PORT_DEPARTURE,
  DISCHARGE_PORT_ARRIVAL,
  CUSTOMS_CLEARANCE,
  WAREHOUSE_ARRIVAL,
  DELIVERY_READY,
} from 'modules/relationMapV2/constants';
import {
  ShipmentCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndPlaceWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  TimelineAndDateWrapperStyle,
  DelayStyle,
  ApprovedIconStyle,
  LatestArrivalDateStyle,
  EarliestArrivalDateStyle,
} from './style';

const getInitLocalShipmentPoint = (globalShipmentPoint: string, voyages: Array<Object>): string => {
  if (
    ((globalShipmentPoint === FIRST_TRANSIT_PORT_ARRIVAL ||
      globalShipmentPoint === FIRST_TRANSIT_PORT_DEPARTURE) &&
      voyages.length < 2) ||
    ((globalShipmentPoint === SECOND_TRANSIT_PORT_ARRIVAL ||
      globalShipmentPoint === SECOND_TRANSIT_PORT_DEPARTURE) &&
      voyages.length < 3)
  ) {
    return CARGO_READY;
  }
  return globalShipmentPoint;
};

type Props = {|
  shipment: Object,
  onViewForm: Event => void,
  onCreateContainer?: Event => void,
  organizationId: string,
|};

export default function ShipmentCard({
  shipment,
  onViewForm,
  onCreateContainer,
  organizationId,
}: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(SHIPMENT_FORM);
  const allowToCreateContainer = hasPermissions(CONTAINER_CREATE);

  const { globalShipmentPoint } = GlobalShipmentPoint.useContainer();
  const { selectors } = FocusedView.useContainer();
  const {
    no,
    tags = [],
    todo = {},
    transportType,
    cargoReady,
    voyages = [{}],
    containerGroups = [{}],
    containers = [],
    totalVolume,
    totalVolumeOverriding,
    totalVolumeOverride,
  } = shipment || {};

  const [localShipmentPoint, setLocalShipmentPoint] = React.useState(
    getInitLocalShipmentPoint(globalShipmentPoint, voyages)
  );

  React.useEffect(() => {
    if (
      globalShipmentPoint === FIRST_TRANSIT_PORT_ARRIVAL ||
      globalShipmentPoint === FIRST_TRANSIT_PORT_DEPARTURE
    ) {
      if (voyages.length > 1) {
        setLocalShipmentPoint(globalShipmentPoint);
      }
    } else if (
      globalShipmentPoint === SECOND_TRANSIT_PORT_ARRIVAL ||
      globalShipmentPoint === SECOND_TRANSIT_PORT_DEPARTURE
    ) {
      if (voyages.length > 2) {
        setLocalShipmentPoint(globalShipmentPoint);
      }
    } else {
      setLocalShipmentPoint(globalShipmentPoint);
    }
  }, [globalShipmentPoint, voyages]);

  let place = null;
  let date = null;
  let earliestContainerActualArrivalDate = null;
  let latestContainerActualArrivalDate = null;
  let earliestContainerAgreedArrivalDate = null;
  let latestContainerAgreedArrivalDate = null;
  let approved = false;
  let firstDate = null;
  let delayAmount = 0;

  switch (localShipmentPoint) {
    case CARGO_READY: {
      date = cargoReady?.latestDate;
      approved = !!cargoReady?.approvedAt;
      firstDate = cargoReady?.date;
      break;
    }
    case LOAD_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[0]?.departurePort);
      date = voyages?.[0]?.departure?.latestDate;
      approved = !!voyages?.[0]?.departure?.approvedAt;
      firstDate = voyages?.[0]?.departure?.date;
      break;
    }
    case FIRST_TRANSIT_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[0]?.arrivalPort);
      date = voyages?.[0]?.arrival?.latestDate;
      approved = !!voyages?.[0]?.arrival?.approvedAt;
      firstDate = voyages?.[0]?.arrival?.date;
      break;
    }
    case FIRST_TRANSIT_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[1]?.departurePort);
      date = voyages?.[1]?.departure?.latestDate;
      approved = !!voyages?.[1]?.departure?.approvedAt;
      firstDate = voyages?.[1]?.departure?.date;
      break;
    }
    case SECOND_TRANSIT_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[1]?.arrivalPort);
      date = voyages?.[1]?.arrival?.latestDate;
      approved = !!voyages?.[1]?.arrival?.approvedAt;
      firstDate = voyages?.[1]?.arrival?.date;
      break;
    }
    case SECOND_TRANSIT_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[2]?.departurePort);
      date = voyages?.[2]?.departure?.latestDate;
      approved = !!voyages?.[2]?.departure?.approvedAt;
      firstDate = voyages?.[2]?.departure?.date;
      break;
    }
    case DISCHARGE_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[voyages.length - 1]?.arrivalPort);
      date = voyages?.[voyages.length - 1]?.arrival?.latestDate;
      approved = !!voyages?.[voyages.length - 1]?.arrival?.approvedAt;
      firstDate = voyages?.[voyages.length - 1]?.arrival?.date;
      break;
    }
    case CUSTOMS_CLEARANCE: {
      date = containerGroups?.[0].customClearance?.latestDate;
      approved = !!containerGroups?.[0].customClearance?.approvedAt;
      firstDate = containerGroups?.[0].customClearance?.date;
      break;
    }
    case WAREHOUSE_ARRIVAL: {
      place = containerGroups?.[0].warehouse?.name;
      approved = !!containerGroups?.[0].warehouseArrival?.approvedAt;
      firstDate = containerGroups?.[0].warehouseArrival?.date;

      if (!containers.length) {
        date = containerGroups?.[0].warehouseArrival?.latestDate;
        break;
      }

      const actualArrivalDates = getActualArrivalDates(containers);
      const agreedArrivalDates = getAgreedArrivalDates(containers);
      if (!actualArrivalDates.length && !agreedArrivalDates.length) {
        earliestContainerActualArrivalDate = shipment.earliestWarehouseActualArrival;
        latestContainerActualArrivalDate = shipment.latestWarehouseActualArrival;
        earliestContainerAgreedArrivalDate = shipment.earliestWarehouseAgreedArrival;
        latestContainerAgreedArrivalDate = shipment.latestWarehouseAgreedArrival;
        date = earliestContainerActualArrivalDate || earliestContainerAgreedArrivalDate;
        break;
      }

      if (actualArrivalDates.length) {
        earliestContainerActualArrivalDate = earliest(actualArrivalDates);
        latestContainerActualArrivalDate = latest(actualArrivalDates);
        date = earliest(actualArrivalDates);
      }
      if (agreedArrivalDates.length) {
        earliestContainerAgreedArrivalDate = earliest(agreedArrivalDates);
        latestContainerAgreedArrivalDate = latest(agreedArrivalDates);
        date = date || earliest(agreedArrivalDates);
      }
      break;
    }
    case DELIVERY_READY: {
      date = containerGroups?.[0].deliveryReady?.latestDate;
      approved = containerGroups?.[0].deliveryReady?.approvedAt;
      firstDate = containerGroups?.[0].deliveryReady?.date;
      break;
    }
    default: {
      break;
    }
  }

  if (date && firstDate) {
    delayAmount = differenceInCalendarDays(new Date(date), new Date(firstDate));
  }

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewPlace = true;
  const canViewTimeline = true;
  const canViewDate = true;
  const canViewTasks = true;
  const canViewTotalVolume = true;

  const totalVol = totalVolumeOverriding ? totalVolumeOverride : totalVolume;

  return (
    <div className={ShipmentCardWrapperStyle(selectors.isShipmentFocus)}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>
          <FullValueTooltip message={no}>
            <span>{no}</span>
          </FullValueTooltip>
        </Display>

        <div className={TagsAndPlaceWrapperStyle}>
          {canViewTags ? (
            <div className={TagsWrapperStyle}>
              {tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <Blackout width="130px" />
          )}

          <Label width="55px">
            <FormattedMessage id="components.cards.place" defaultMessage="PLACE" />
          </Label>
          <Display blackout={!canViewPlace} width={selectors.isShipmentFocus ? '240px' : '130px'}>
            {place}
          </Display>
        </div>

        {canViewTotalVolume && (
          <Label>
            <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
          </Label>
        )}
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={TimelineAndDateWrapperStyle}>
          {canViewTimeline ? (
            <MiniShipmentTimeline
              shipment={shipment}
              activePoint={localShipmentPoint}
              onChangeActivePoint={point => setLocalShipmentPoint(point)}
            />
          ) : (
            <Blackout width="300px" />
          )}

          <Label width="55px">
            <FormattedMessage id="components.cards.date" defaultMessage="DATE" />
          </Label>

          {canViewDate ? (
            <>
              {localShipmentPoint === WAREHOUSE_ARRIVAL &&
              (earliestContainerActualArrivalDate || earliestContainerAgreedArrivalDate) ? (
                <Tooltip
                  message={
                    <>
                      {earliestContainerActualArrivalDate && (
                        <div>
                          <Label width="440px">
                            <FormattedMessage
                              id="components.cards.containerWarehouseActualArrivalDate"
                              defaultMessage="Container's Warehouse Actual Arrival Date"
                            />
                          </Label>
                          <span className={EarliestArrivalDateStyle}>
                            <FormattedDate value={earliestContainerActualArrivalDate} />
                          </span>
                          -
                          <span className={LatestArrivalDateStyle}>
                            <FormattedDate value={latestContainerActualArrivalDate} />
                          </span>
                        </div>
                      )}
                      {earliestContainerAgreedArrivalDate && (
                        <div>
                          <Label width="440px">
                            <FormattedMessage
                              id="components.cards.containerWarehouseAgreedArrivalDate"
                              defaultMessage="Container's Warehouse Agreed Arrival Date"
                            />
                          </Label>
                          <span className={EarliestArrivalDateStyle}>
                            <FormattedDate value={earliestContainerAgreedArrivalDate} />
                          </span>
                          -
                          <span className={LatestArrivalDateStyle}>
                            <FormattedDate value={latestContainerAgreedArrivalDate} />
                          </span>
                        </div>
                      )}
                    </>
                  }
                >
                  <div>
                    <Display width="80px">
                      <FormattedDate value={date} />
                    </Display>
                  </div>
                </Tooltip>
              ) : (
                <Display width="80px">
                  <FormattedDate value={date} />
                </Display>
              )}

              <div className={DelayStyle(delayAmount)}>
                {delayAmount !== 0 && (
                  <>
                    {delayAmount > 0 ? '+' : ''}
                    <FormattedNumber value={delayAmount} />
                  </>
                )}
              </div>

              <div className={ApprovedIconStyle(approved)}>
                <Icon icon="CHECKED" />
              </div>
            </>
          ) : (
            <Blackout width={selectors.isShipmentFocus ? '240px' : '130px'} />
          )}
        </div>

        <Display blackout={!canViewTotalVolume}>
          {totalVol && <FormattedNumber value={totalVol.value} suffix={totalVol.metric} />}
        </Display>

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
          allowToCreateContainer && selectors.isShipmentFocus
            ? {
                label: (
                  <FormattedMessage
                    id="modules.RelationMap.cards.createContainer"
                    defaultMessage="Create Container"
                  />
                ),
                onClick: onCreateContainer,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
