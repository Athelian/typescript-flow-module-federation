// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import { Display, Blackout, Label } from 'components/Form';
import { FocusedView, GlobalShipmentPoint } from 'modules/relationMapV2/store';
import { useHasPermissions } from 'contexts/Permissions';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import { getPort } from 'utils/shipment';
import { differenceInCalendarDays } from 'utils/date';
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
      if (containers.length === 0) {
        place = containerGroups?.[0].warehouse?.name;
        date = containerGroups?.[0].warehouseArrival?.latestDate;
        approved = !!containerGroups?.[0].warehouseArrival?.approvedAt;
        firstDate = containerGroups?.[0].warehouseArrival?.date;
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

  return (
    <div className={ShipmentCardWrapperStyle(selectors.isShipmentFocus)}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>{no}</Display>

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
          <Display blackout={!canViewPlace} width={selectors.isShipmentFocus ? '235px' : '130px'}>
            {place}
          </Display>
        </div>
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
              <Display width="80px">
                <FormattedDate value={date} />
              </Display>

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
            <Blackout width={selectors.isShipmentFocus ? '235px' : '130px'} />
          )}
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
