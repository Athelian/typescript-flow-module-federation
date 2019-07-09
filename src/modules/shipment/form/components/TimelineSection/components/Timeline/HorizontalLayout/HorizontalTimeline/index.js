// @flow
import * as React from 'react';
import type {
  ShipmentPayload,
  UserPayload,
  TimelineDatePayload,
  VoyagePayload,
  ContainerGroupPayload,
  ContainerPayload,
  TransportType,
} from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import {
  TimelineIcon,
  TimelineTransitIcon,
  TimelineLine,
  TimelineVoyage,
  TimelineWarehouseContainerIcon,
  TimelineContainerIcon,
} from 'modules/shipment/form/components/TimelineSection/components/Timeline/components';
import {
  getTimelineColoring,
  getTransportIcon,
} from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import { Tooltip } from 'components/Tooltip';
import {
  HorizontalTimelineWrapperStyle,
  BlankSpaceStyle,
  ContainerIconWrapperStyle,
  WarehouseContainerWrapperStyle,
  TooltipTitleStyle,
} from './style';

type Props = {|
  shipment: ShipmentPayload,
  navigable: {
    form: boolean,
  },
|};

const ApprovedBy = (user: UserPayload) => {
  return (
    <FormattedMessage
      id="components.Shipments.approvedBy"
      defaultMessage="Approved by {firstName} {lastName}"
      values={user}
    />
  );
};

const HorizontalTimeline = ({ shipment, navigable }: Props) => {
  const cargoReady: TimelineDatePayload = getByPathWithDefault({}, 'cargoReady', shipment);
  const voyages: Array<VoyagePayload> = getByPathWithDefault([], 'voyages', shipment);
  const containerGroups: Array<ContainerGroupPayload> = getByPathWithDefault(
    [],
    'containerGroups',
    shipment
  );
  const transportType: TransportType = getByPathWithDefault('', 'transportType', shipment);
  const containers: Array<ContainerPayload> = getByPathWithDefault([], 'containers', shipment);

  const transportIcon = getTransportIcon(transportType);

  const coloring = getTimelineColoring({ cargoReady, voyages, containerGroups });

  const cargoReadyColoring = coloring[0];
  const loadPortDepartureColoring = coloring[1];
  const dischargePortArrivalColoring = coloring[coloring.length - 4];
  const customClearanceColoring = coloring[coloring.length - 3];
  const warehouseArrivalColoring = coloring[coloring.length - 2];
  const deliveryReadyColoring = coloring[coloring.length - 1];
  const shipmentId = encodeId(getByPathWithDefault('', 'id', shipment));

  return (
    <div className={HorizontalTimelineWrapperStyle}>
      <div className={BlankSpaceStyle} />
      <Tooltip
        message={
          <div>
            <div className={TooltipTitleStyle}>
              <FormattedMessage id="components.Shipments.cargoReady" defaultMessage="CARGO READY" />
            </div>
            {getByPathWithDefault(null, 'approvedAt', cargoReady) ? (
              <ApprovedBy user={getByPathWithDefault(null, 'approvedBy', cargoReady)} />
            ) : (
              <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
            )}
          </div>
        }
      >
        <div>
          <TimelineIcon
            icon="CARGO_READY"
            color={cargoReadyColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/cargoReady` : ''}
          />
        </div>
      </Tooltip>

      <TimelineLine color={loadPortDepartureColoring} />

      <TimelineIcon
        icon="PORT"
        color={loadPortDepartureColoring}
        linkPath={navigable.form ? `/shipment/${shipmentId}/loadPortDeparture` : ''}
      />

      <TimelineVoyage>
        <TimelineLine color={loadPortDepartureColoring} />
        <TimelineLine color={coloring[2]} />
        <TimelineIcon
          icon={transportIcon}
          color={loadPortDepartureColoring}
          linkPath={navigable.form ? `/shipment/${shipmentId}/firstVoyage` : ''}
        />
      </TimelineVoyage>

      {voyages.length > 1 &&
        voyages.slice(1).map((voyage, index) => (
          <React.Fragment key={getByPathWithDefault('', 'id', 'voyage')}>
            <TimelineTransitIcon
              color={coloring[index * 2 + 2]}
              arrivalLinkPath={
                navigable.form
                  ? `/shipment/${shipmentId}/${
                      index === 0 ? 'firstTransitPortArrival' : 'secondTransitPortArrival'
                    }`
                  : ''
              }
              departureLinkPath={
                navigable.form
                  ? `/shipment/${shipmentId}/${
                      index === 0 ? 'firstTransitPortDeparture' : 'secondTransitPortDeparture'
                    }`
                  : ''
              }
            />

            <TimelineVoyage>
              <TimelineLine color={coloring[index * 2 + 3]} />
              <TimelineLine color={coloring[index * 2 + 4]} />
              <TimelineIcon
                icon={transportIcon}
                color={coloring[index * 2 + 3]}
                linkPath={
                  navigable.form
                    ? `/shipment/${shipmentId}/${index === 0 ? 'secondVoyage' : 'thirdVoyage'}`
                    : ''
                }
              />
            </TimelineVoyage>
          </React.Fragment>
        ))}

      <TimelineIcon
        icon="PORT"
        color={dischargePortArrivalColoring}
        linkPath={navigable.form ? `/shipment/${shipmentId}/dischargePortArrival` : ''}
      />

      <TimelineLine color={customClearanceColoring} />

      <TimelineIcon
        icon="CUSTOMS"
        color={customClearanceColoring}
        linkPath={navigable.form ? `/shipment/${shipmentId}/customClearance` : ''}
      />

      {containers && containers.length > 0 ? (
        <>
          <TimelineLine color={warehouseArrivalColoring} flex="1.59" />

          <div className={WarehouseContainerWrapperStyle}>
            <div className={ContainerIconWrapperStyle}>
              <TimelineContainerIcon />
            </div>
            <TimelineWarehouseContainerIcon
              containers={containers}
              targetId="containersWarehouseArrival"
              boundaryId="timelineInfoSection"
            />
          </div>

          <TimelineLine color={deliveryReadyColoring} flex="1.59" />
        </>
      ) : (
        <>
          <TimelineLine color={warehouseArrivalColoring} />

          <TimelineIcon
            icon="WAREHOUSE"
            color={warehouseArrivalColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/warehouseArrival` : ''}
          />

          <TimelineLine color={deliveryReadyColoring} />
        </>
      )}

      <TimelineIcon
        icon="DELIVERY_READY"
        color={deliveryReadyColoring}
        linkPath={navigable.form ? `/shipment/${shipmentId}/deliveryReady` : ''}
      />

      <div className={BlankSpaceStyle} />
    </div>
  );
};

export default HorizontalTimeline;
