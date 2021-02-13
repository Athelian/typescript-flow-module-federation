// @flow
import * as React from 'react';
import type { Shipment } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import TaskRing from 'components/TaskRing';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { HorizontalLayout } from 'modules/shipment/form/components/TimelineSection/components/Timeline';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import { CONTAINER_TYPE_ITEMS, CONTAINER_TYPE_MAP } from 'modules/container/constants';
import { getUniqueExporters } from 'utils/shipment';
import BaseCard from '../BaseCard';
import {
  ShipmentCardWrapperStyle,
  ShipmentInfoWrapperStyle,
  ShipmentLeftWrapperStyle,
  ShipmentNoWrapperStyle,
  ShipmentBookedStyle,
  ShipmentNoStyle,
  ShipmentBLStyle,
  ShipmentRightWrapperStyle,
  ShipmentHeaderWrapperStyle,
  ShipmentTagsWrapperStyle,
  ShipmentImporterWrapperStyle,
  ShipmentImporterIconStyle,
  ShipmentImporterStyle,
  ShipmentExporterWrapperStyle,
  ShipmentExporterIconStyle,
  ShipmentExporterStyle,
  RemainingExporterCountStyle,
  ShipmentDataWrapperStyle,
  ShipmentBadgeWrapperStyle,
  ShipmentBadgeIconStyle,
  ShipmentBadgeStyle,
  DividerStyle,
  ContainerTypeTooltipTitleStyle,
  ContainerTypeWrapperStyle,
  ContainerTypeLabelStyle,
  ContainerTypeCountStyle,
} from './style';

type Props = {|
  actions: Array<React.Node>,
  onClick: Function,
  onSelect: Function,
  shipment: Shipment,
  navigable?: boolean,
|};

const defaultProps = {
  actions: [],
  navigable: true,
};

const ShipmentCard = ({ shipment, navigable, actions, onClick, onSelect, ...rest }: Props) => {
  const {
    archived,
    no,
    blNo,
    booked,
    tags,
    batchCount,
    orderItemCount,
    totalVolume,
    totalVolumeOverriding,
    totalVolumeOverride,
    containers,
    importer,
    exporter,
    todo,
    containerTypeCounts,
    voyages,
    totalPackageQuantity,
    totalPackageQuantityOverriding,
    totalPackageQuantityOverride,
    batches,
  } = shipment;
  let exporterName = '';
  let remainingExporterCount = 0;
  if (exporter) {
    exporterName = exporter.name;
  } else {
    const uniqueExporters = getUniqueExporters(batches);
    if (uniqueExporters.length > 0) {
      exporterName = uniqueExporters[0].name;
      remainingExporterCount = uniqueExporters.length - 1;
    }
  }

  const sortedContainerTypes = containerTypeCounts ? [...containerTypeCounts] : [];
  sortedContainerTypes.sort((firstContainerType, secondContainerType) => {
    const firstContainerTypeSortIndex = CONTAINER_TYPE_ITEMS.findIndex(
      ({ value }) => value === firstContainerType.containerType
    );
    const secondContainerTypeSortIndex = CONTAINER_TYPE_ITEMS.findIndex(
      ({ value }) => value === secondContainerType.containerType
    );

    return firstContainerTypeSortIndex - secondContainerTypeSortIndex;
  });

  const totalContainerTypeCount = sortedContainerTypes.reduce((sum, { count }) => sum + count, 0);

  const totalVol = totalVolumeOverriding ? totalVolumeOverride : totalVolume;

  const totalPackages = totalPackageQuantityOverriding
    ? totalPackageQuantityOverride
    : totalPackageQuantity;

  const onShipmentSelect = () => {
    if (onSelect) {
      onSelect(shipment);
    }
  };

  return (
    <BaseCard
      showBadge={shipment?.notificationUnseenCount > 0}
      icon="SHIPMENT"
      color="SHIPMENT"
      actions={actions}
      isArchived={archived}
      onSelect={onShipmentSelect}
      {...rest}
    >
      <div className={ShipmentCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ShipmentInfoWrapperStyle}>
          <div className={ShipmentLeftWrapperStyle}>
            <div className={ShipmentNoWrapperStyle}>
              <div className={ShipmentBookedStyle(booked)}>
                {booked ? (
                  <FormattedMessage id="modules.Shipments.booked" defaultMessage="Booked" />
                ) : (
                  <FormattedMessage id="modules.Shipments.unbooked" defaultMessage="Unbooked" />
                )}
              </div>
              <FullValueTooltip message={no}>
                <div className={ShipmentNoStyle}>{no}</div>
              </FullValueTooltip>
            </div>
            <div className={ShipmentBLStyle}>{blNo}</div>
          </div>

          <div className={ShipmentRightWrapperStyle}>
            <div className={ShipmentHeaderWrapperStyle}>
              <div className={ShipmentTagsWrapperStyle}>
                {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
              </div>

              <FullValueTooltip message={importer && importer.name}>
                <div className={ShipmentImporterWrapperStyle}>
                  <div className={ShipmentImporterIconStyle}>
                    <Icon icon="IMPORTER" />
                  </div>
                  <div className={ShipmentImporterStyle}>{importer && importer.name}</div>
                </div>
              </FullValueTooltip>

              <FullValueTooltip message={exporterName}>
                <div className={ShipmentExporterWrapperStyle}>
                  <div className={ShipmentExporterIconStyle}>
                    <Icon icon="EXPORTER" />
                  </div>
                  <div className={ShipmentExporterStyle(remainingExporterCount)}>
                    {exporterName}
                  </div>
                  {remainingExporterCount !== 0 && (
                    <div className={RemainingExporterCountStyle}>
                      +<FormattedNumber value={remainingExporterCount} />
                    </div>
                  )}
                </div>
              </FullValueTooltip>
            </div>

            <div className={ShipmentDataWrapperStyle}>
              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.lastVessel" defaultMessage="LAST VESSEL" />
                </Label>
                <FullValueTooltip
                  message={getByPathWithDefault(
                    '',
                    `${(voyages || []).length - 1}.vesselName`,
                    voyages
                  )}
                >
                  <div className={ShipmentBadgeStyle('60px')}>
                    {getByPathWithDefault(
                      <FormattedMessage id="components.cards.na" defaultMessage="N/A" />,
                      `${(voyages || []).length - 1}.vesselName`,
                      voyages
                    )}
                  </div>
                </FullValueTooltip>
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
                </Label>
                <div className={ShipmentBadgeStyle('60px')}>
                  {totalVol && <FormattedNumber value={totalVol.value} suffix={totalVol.metric} />}
                </div>
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.ttlPkgs" defaultMessage="TTL PKGS" />
                </Label>
                <div className={ShipmentBadgeStyle('40px')}>
                  <FormattedNumber value={totalPackages} />
                </div>
              </div>

              <Tooltip
                message={
                  <div>
                    <div className={ContainerTypeTooltipTitleStyle}>
                      <FormattedMessage
                        id="components.cards.containerTypesTitle"
                        defaultMessage="CONTAINER TYPES"
                      />
                    </div>

                    {sortedContainerTypes.map(({ containerType, count }) => {
                      return (
                        <div className={ContainerTypeWrapperStyle} key={containerType}>
                          <div className={ContainerTypeLabelStyle}>
                            {CONTAINER_TYPE_MAP[containerType]}
                          </div>
                          <div className={ContainerTypeCountStyle}>
                            <FormattedNumber value={count} />
                          </div>
                        </div>
                      );
                    })}

                    {(totalContainerTypeCount < (containers ? containers.length : 0) ||
                      (containers && containers.length === 0)) && (
                      <div className={ContainerTypeWrapperStyle}>
                        <div className={ContainerTypeLabelStyle}>
                          <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
                        </div>
                        <div className={ContainerTypeCountStyle}>
                          <FormattedNumber value={containers.length - totalContainerTypeCount} />
                        </div>
                      </div>
                    )}
                  </div>
                }
              >
                <div className={ShipmentBadgeWrapperStyle}>
                  <div className={ShipmentBadgeIconStyle}>
                    <Icon icon="CONTAINER" />
                  </div>
                  <div className={ShipmentBadgeStyle('30px')}>
                    <FormattedNumber value={containers ? containers.length : 0} />
                  </div>
                </div>
              </Tooltip>

              <div className={ShipmentBadgeWrapperStyle}>
                <div className={ShipmentBadgeIconStyle}>
                  <Icon icon="ORDER_ITEM" />
                </div>
                <div className={ShipmentBadgeStyle('30px')}>
                  <FormattedNumber value={orderItemCount} />
                </div>
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <div className={ShipmentBadgeIconStyle}>
                  <Icon icon="BATCH" />
                </div>
                <div className={ShipmentBadgeStyle('30px')}>
                  <FormattedNumber value={batchCount} />
                </div>
              </div>
              <TaskRing {...todo} />
            </div>
          </div>
        </div>
        <div className={DividerStyle} />
        <HorizontalLayout shipment={shipment} navigable={Boolean(navigable)} />
      </div>
    </BaseCard>
  );
};

ShipmentCard.defaultProps = defaultProps;

export default withForbiddenCard(React.memo(ShipmentCard), 'shipment', {
  width: '860px',
  height: '164px',
  entityIcon: 'SHIPMENT',
  entityColor: 'SHIPMENT',
});
