// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { GlobalShipmentPoint } from 'modules/relationMapV2/store';
import MiniShipmentTimeline from 'modules/relationMapV2/components/MiniShipmentTimeline';
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
} from './style';

const getPort = (transportType: ?string, port: Object = {}): string => {
  if (transportType) {
    if (transportType === 'Air') {
      return port.airportName || '';
    }
    if (transportType === 'Sea') {
      return port.seaportName || '';
    }
  }
  return '';
};

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
|};

export default function ShipmentCard({ shipment }: Props) {
  const { globalShipmentPoint } = GlobalShipmentPoint.useContainer();

  const {
    no,
    tags = [],
    todo = {},
    transportType,
    cargoReady,
    voyages = [{}],
    containerGroups = [{}],
  } = shipment;

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

  let place = '';
  let date = '';
  switch (localShipmentPoint) {
    case CARGO_READY: {
      place = '';
      date = cargoReady?.latestDate;
      break;
    }
    case LOAD_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[0]?.departurePort);
      date = voyages?.[0]?.departure?.latestDate;
      break;
    }
    case FIRST_TRANSIT_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[0]?.arrivalPort);
      date = voyages?.[0]?.arrival?.latestDate;
      break;
    }
    case FIRST_TRANSIT_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[1]?.departurePort);
      date = voyages?.[1]?.departure?.latestDate;
      break;
    }
    case SECOND_TRANSIT_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[1]?.arrivalPort);
      date = voyages?.[1]?.arrival?.latestDate;
      break;
    }
    case SECOND_TRANSIT_PORT_DEPARTURE: {
      place = getPort(transportType, voyages?.[2]?.departurePort);
      date = voyages?.[2]?.departure?.latestDate;
      break;
    }
    case DISCHARGE_PORT_ARRIVAL: {
      place = getPort(transportType, voyages?.[voyages.length - 1]?.arrivalPort);
      date = voyages?.[voyages.length - 1]?.arrival?.latestDate;
      break;
    }
    case CUSTOMS_CLEARANCE: {
      place = '';
      date = containerGroups?.[0].customClearance?.latestDate;
      break;
    }
    case WAREHOUSE_ARRIVAL: {
      place = containerGroups?.[0].warehouse?.name;
      date = containerGroups?.[0].warehouseArrival?.latestDate;
      break;
    }
    case DELIVERY_READY: {
      place = '';
      date = containerGroups?.[0].deliveryReady?.latestDate;
      break;
    }
    default: {
      place = '';
      date = '';
    }
  }

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewPlace = true;
  const canViewTimeline = true;
  const canViewDate = true;
  const canViewTasks = true;

  return (
    <div className={ShipmentCardWrapperStyle}>
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
            <Blackout />
          )}

          <Label width="55px">
            <FormattedMessage id="components.cards.place" defaultMessage="PLACE" />
          </Label>
          <Display blackout={!canViewPlace} width="130px">
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
          <Display blackout={!canViewDate} width="130px">
            <FormattedDate value={date} />
          </Display>
        </div>

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>
    </div>
  );
}
