// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Label } from 'components/Form';
import { isBefore, isAfter, differenceInCalendarDays } from 'utils/date';
import { getPort } from 'utils/shipment';
import Heading from 'modules/relationMapV2/components/Heading';
import {
  SHIPMENT_WIDTH,
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
  SHIPMENT,
} from 'modules/relationMapV2/constants';
import { GlobalShipmentPoint, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { RightWrapperStyle, PlaceWrapperStyle, DatesWrapperStyle } from './style';

type AllocateDateType = {
  place?: ?string,
  date: ?string,
  data: {
    places: Array<string>,
    oldestDate: ?string,
    newestDate: ?string,
  },
};

const allocateDate = ({ place, date, data }: AllocateDateType) => {
  const { places } = data;
  let { oldestDate, newestDate } = data;

  if (place && !places.includes(place)) {
    places.push(place);
  }

  if (date) {
    if (!oldestDate) {
      oldestDate = date;
    } else if (isBefore(new Date(date), new Date(oldestDate))) {
      oldestDate = date;
    }

    if (!newestDate) {
      newestDate = date;
    } else if (isAfter(new Date(date), new Date(newestDate))) {
      newestDate = date;
    }
  }

  return { places, oldestDate, newestDate };
};

const getShipmentPointData = (shipments: Array<Object>, globalShipmentPoint: string) => {
  let data = { places: [], oldestDate: null, newestDate: null };

  shipments.forEach(shipment => {
    const {
      transportType,
      cargoReady,
      voyages = [{}],
      containerGroups = [{}],
      containers = [],
    } = shipment;

    switch (globalShipmentPoint) {
      case CARGO_READY: {
        data = allocateDate({ date: cargoReady?.latestDate, data });
        break;
      }
      case LOAD_PORT_DEPARTURE: {
        const date = voyages?.[0]?.departure?.latestDate;
        const place = getPort(transportType, voyages?.[0]?.departurePort);
        data = allocateDate({ place, date, data });
        break;
      }
      case FIRST_TRANSIT_PORT_ARRIVAL: {
        if (voyages?.length > 1) {
          const date = voyages?.[0]?.arrival?.latestDate;
          const place = getPort(transportType, voyages?.[0]?.arrivalPort);
          data = allocateDate({ place, date, data });
        }
        break;
      }
      case FIRST_TRANSIT_PORT_DEPARTURE: {
        if (voyages?.length > 1) {
          const date = voyages?.[1]?.departure?.latestDate;
          const place = getPort(transportType, voyages?.[1]?.departurePort);
          data = allocateDate({ place, date, data });
        }
        break;
      }
      case SECOND_TRANSIT_PORT_ARRIVAL: {
        if (voyages?.length > 2) {
          const date = voyages?.[1]?.arrival?.latestDate;
          const place = getPort(transportType, voyages?.[1]?.arrivalPort);
          data = allocateDate({ place, date, data });
        }
        break;
      }
      case SECOND_TRANSIT_PORT_DEPARTURE: {
        if (voyages?.length > 2) {
          const date = voyages?.[2]?.departure?.latestDate;
          const place = getPort(transportType, voyages?.[2]?.departurePort);
          data = allocateDate({ place, date, data });
        }
        break;
      }
      case DISCHARGE_PORT_ARRIVAL: {
        const date = voyages?.[voyages.length - 1]?.arrival?.latestDate;
        const place = getPort(transportType, voyages?.[voyages.length - 1]?.arrivalPort);
        data = allocateDate({ place, date, data });
        break;
      }
      case CUSTOMS_CLEARANCE: {
        const date = containerGroups?.[0].customClearance?.latestDate;
        data = allocateDate({ date, data });
        break;
      }
      case WAREHOUSE_ARRIVAL: {
        if (containers.length === 0) {
          const date = containerGroups?.[0].warehouseArrival?.latestDate;
          const place = containerGroups?.[0].warehouse?.name;
          data = allocateDate({ place, date, data });
        }
        break;
      }
      case DELIVERY_READY: {
        const date = containerGroups?.[0].deliveryReady?.latestDate;
        data = allocateDate({ date, data });
        break;
      }
      default: {
        break;
      }
    }
  });

  return data;
};

type Props = {|
  shipments: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
|};

export default function ShipmentHeading({
  shipments,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
}: Props) {
  const { globalShipmentPoint } = GlobalShipmentPoint.useContainer();

  const { places, oldestDate, newestDate } = getShipmentPointData(shipments, globalShipmentPoint);

  // TODO: Replace with real permissions
  const canViewPlace = true;
  const canViewDate = true;
  const { state } = FocusedView.useContainer();
  const shipmentIds = targetedIds(state.targets, SHIPMENT);
  const selectedItemsCount = shipments.filter(item => shipmentIds.includes(item.id)).length;

  return (
    <Heading
      width={`${SHIPMENT_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      selectedItemsCount={selectedItemsCount}
      onSelectAll={onSelectAll}
      renderRightSide={() => (
        <div className={RightWrapperStyle}>
          <div className={PlaceWrapperStyle}>
            <Label width="55px">
              <FormattedMessage id="components.cards.place" defaultMessage="PLACE" />
            </Label>

            <Display blackout={!canViewPlace}>{places.length > 0 && places[0]}</Display>

            {canViewPlace && places.length > 1 && (
              <Display width="min-content">
                +
                <FormattedNumber value={places.length - 1} />
              </Display>
            )}
          </div>

          <div className={DatesWrapperStyle}>
            <Label width="55px">
              <FormattedMessage id="components.cards.date" defaultMessage="DATE" />
            </Label>

            <Display blackout={!canViewDate}>
              <FormattedDate value={oldestDate} />

              {oldestDate &&
                newestDate &&
                differenceInCalendarDays(new Date(oldestDate), new Date(newestDate)) !== 0 && (
                  <>
                    {' - '}
                    <FormattedDate value={newestDate} />
                  </>
                )}
            </Display>
          </div>
        </div>
      )}
    />
  );
}
