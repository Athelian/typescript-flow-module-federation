// @flow
import React, { Fragment } from 'react';
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
  TimelineDate,
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
  TooltipWrapperStyle,
  TooltipGirdStyle,
  TooltipTitleStyle,
  TooltipLabelStyle,
} from './style';

type Props = {|
  shipment: ShipmentPayload,
  navigable: {
    form: boolean,
  },
|};

const ApprovedBy = ({ user }: { user: UserPayload }) => {
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

      <Tooltip
        message={
          <div>
            <div className={TooltipTitleStyle}>
              <FormattedMessage
                id="components.Shipments.loadPortDeparture"
                defaultMessage="LOAD PORT DEPARTURE"
              />
            </div>
            {getByPathWithDefault(null, '0.departure.approvedAt', voyages) ? (
              <ApprovedBy user={getByPathWithDefault(null, '0.departure.approvedBy', voyages)} />
            ) : (
              <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
            )}
          </div>
        }
      >
        <div>
          <TimelineIcon
            icon="PORT"
            color={loadPortDepartureColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/loadPortDeparture` : ''}
          />
        </div>
      </Tooltip>

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
          <React.Fragment key={getByPathWithDefault(index, 'id', 'voyage')}>
            <Tooltip
              message={
                <div className={TooltipWrapperStyle}>
                  <div className={TooltipTitleStyle}>
                    {index ? (
                      <FormattedMessage
                        id="components.Shipments.secondTransitPortArrival"
                        defaultMessage="SECOND TRANSIT PORT ARRIVAL"
                      />
                    ) : (
                      <FormattedMessage
                        id="components.Shipments.firstTransitPortArrival"
                        defaultMessage="FIRST TRANSIT PORT ARRIVAL"
                      />
                    )}
                  </div>
                  {getByPathWithDefault(null, `${index + 1}.arrival.approvedAt`, voyages) ? (
                    <ApprovedBy
                      user={getByPathWithDefault(null, `${index + 1}.arrival.approvedBy`, voyages)}
                    />
                  ) : (
                    <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
                  )}
                  <div className={TooltipTitleStyle}>
                    <FormattedMessage
                      id="components.Shipments.departure"
                      defaultMessage="DEPARTURE"
                    />
                  </div>
                  {getByPathWithDefault(null, `${index + 1}.departure.approvedAt`, voyages) ? (
                    <ApprovedBy
                      user={getByPathWithDefault(
                        null,
                        `${index + 1}.departure.approvedBy`,
                        voyages
                      )}
                    />
                  ) : (
                    <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
                  )}
                </div>
              }
            >
              <div>
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
              </div>
            </Tooltip>
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

      <Tooltip
        message={
          <div>
            <div className={TooltipTitleStyle}>
              <FormattedMessage
                id="components.Shipments.dischargePortArrival"
                defaultMessage="DISCHARGE PORT ARRIVAL"
              />
            </div>
            {getByPathWithDefault(
              null,
              `${(voyages || []).length - 1}.arrival.approvedAt`,
              voyages
            ) ? (
              <ApprovedBy
                user={getByPathWithDefault(
                  null,
                  `${(voyages || []).length - 1}.arrival.approvedBy`,
                  voyages
                )}
              />
            ) : (
              <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
            )}
          </div>
        }
      >
        <div>
          <TimelineIcon
            icon="PORT"
            color={dischargePortArrivalColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/dischargePortArrival` : ''}
          />
        </div>
      </Tooltip>

      <TimelineLine color={customClearanceColoring} />

      <Tooltip
        message={
          <div>
            <div className={TooltipTitleStyle}>
              <FormattedMessage
                id="components.Shipments.customClearance"
                defaultMessage="CUSTOMS CLEARANCE"
              />
            </div>
            {getByPathWithDefault(null, '0.customClearance.approvedAt', containerGroups) ? (
              <ApprovedBy
                user={getByPathWithDefault(null, '0.customClearance.approvedBy', containerGroups)}
              />
            ) : (
              <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
            )}
          </div>
        }
      >
        <div>
          <TimelineIcon
            icon="CUSTOMS"
            color={customClearanceColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/customClearance` : ''}
          />
        </div>
      </Tooltip>

      {containers && containers.length > 0 ? (
        <>
          <TimelineLine color={warehouseArrivalColoring} flex="1.59" />

          <div className={WarehouseContainerWrapperStyle}>
            <div className={ContainerIconWrapperStyle}>
              <TimelineContainerIcon />
            </div>
            <Tooltip
              message={
                <div>
                  <div className={TooltipTitleStyle}>
                    <FormattedMessage
                      id="components.Shipments.warehouseArrival"
                      defaultMessage="WAREHOUSE ARRIVAL"
                    />
                  </div>
                  <div className={TooltipGirdStyle}>
                    <div>
                      <FormattedMessage
                        id="components.Shipments.containers"
                        defaultMessage="CONTAINERS"
                      />
                    </div>
                    <div>
                      <FormattedMessage
                        id="components.Shipments.agreedDateLabel"
                        defaultMessage="AGREED"
                      />
                    </div>
                    <div>
                      <FormattedMessage
                        id="components.Shipments.actualDateLabel"
                        defaultMessage="ACTUAL"
                      />
                    </div>
                    {containers.map(container => (
                      <Fragment key={getByPathWithDefault('', 'id', container)}>
                        <div className={TooltipLabelStyle}>
                          {getByPathWithDefault('', 'no', container)}
                        </div>
                        <div>
                          <TimelineDate
                            color="WHITE"
                            timelineDate={{
                              date: getByPathWithDefault(
                                null,
                                'warehouseArrivalAgreedDate',
                                container
                              ),
                              approvedAt: getByPathWithDefault(
                                null,
                                'warehouseArrivalAgreedDateApprovedAt',
                                container
                              ),
                              timelineDateRevisions: [],
                            }}
                          />
                        </div>
                        <div>
                          <TimelineDate
                            color="WHITE"
                            timelineDate={{
                              date: getByPathWithDefault(
                                null,
                                'warehouseArrivalActualDate',
                                container
                              ),
                              approvedAt: getByPathWithDefault(
                                null,
                                'warehouseArrivalActualDateApprovedAt',
                                container
                              ),
                              timelineDateRevisions: [],
                            }}
                          />
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              }
            >
              <div>
                <TimelineWarehouseContainerIcon
                  containers={containers}
                  targetId="containersWarehouseArrival"
                  boundaryId="timelineInfoSection"
                />
              </div>
            </Tooltip>
          </div>

          <TimelineLine color={deliveryReadyColoring} flex="1.59" />
        </>
      ) : (
        <>
          <TimelineLine color={warehouseArrivalColoring} />

          <Tooltip
            message={
              <div>
                <div className={TooltipTitleStyle}>
                  <FormattedMessage
                    id="components.Shipments.warehouseArrival"
                    defaultMessage="WAREHOUSE ARRIVAL"
                  />
                </div>
                {getByPathWithDefault(null, '0.warehouseArrival.approvedAt', containerGroups) ? (
                  <ApprovedBy
                    user={getByPathWithDefault(
                      null,
                      '0.warehouseArrival.approvedBy',
                      containerGroups
                    )}
                  />
                ) : (
                  <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
                )}
              </div>
            }
          >
            <div>
              <TimelineIcon
                icon="WAREHOUSE"
                color={warehouseArrivalColoring}
                linkPath={navigable.form ? `/shipment/${shipmentId}/warehouseArrival` : ''}
              />
            </div>
          </Tooltip>

          <TimelineLine color={deliveryReadyColoring} />
        </>
      )}

      <Tooltip
        message={
          <div>
            <div className={TooltipTitleStyle}>
              <FormattedMessage
                id="components.Shipments.deliveryReady"
                defaultMessage="DELIVERY READY"
              />
            </div>
            {getByPathWithDefault(null, '0.deliveryReady.approvedAt', containerGroups) ? (
              <ApprovedBy
                user={getByPathWithDefault(null, '0.deliveryReady.approvedBy', containerGroups)}
              />
            ) : (
              <FormattedMessage id="modules.cards.unapproved" defaultMessage="Unapproved" />
            )}
          </div>
        }
      >
        <div>
          <TimelineIcon
            icon="DELIVERY_READY"
            color={deliveryReadyColoring}
            linkPath={navigable.form ? `/shipment/${shipmentId}/deliveryReady` : ''}
          />
        </div>
      </Tooltip>
      <div className={BlankSpaceStyle} />
    </div>
  );
};

export default HorizontalTimeline;
