// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import Tag from 'components/Tag';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import TaskRing from 'components/TaskRing';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { HorizontalLayout } from 'modules/shipment/form/components/TimelineSection/components/Timeline';
import { Tooltip } from 'components/Tooltip';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
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
  ShipmentDataWrapperStyle,
  ShipmentInChargeWrapperStyle,
  InChargeStyle,
  ShipmentBadgeWrapperStyle,
  ShipmentBadgeIconStyle,
  ShipmentBadgeStyle,
  DividerStyle,
  ContainerTypeTooltipTitleStyle,
  ContainerTypeWrapperStyle,
  ContainerTypeLabelStyle,
  ContainerTypeCountStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  actions: [],
};

const ShipmentCard = ({ shipment, actions, ...rest }: Props) => {
  const {
    archived,
    id,
    no,
    blNo,
    booked,
    tags,
    inCharges,
    batchCount,
    orderItemCount,
    totalVolume,
    containers,
    importer,
    todo,
    containerTypeCounts,
    voyages,
  } = shipment;

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

  return (
    <BaseCard icon="SHIPMENT" color="SHIPMENT" actions={actions} isArchived={archived} {...rest}>
      <div
        className={ShipmentCardWrapperStyle}
        onClick={() => navigate(`/shipment/${encodeId(id)}`)}
        role="presentation"
      >
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
              <div className={ShipmentNoStyle}>{no}</div>
            </div>
            <div className={ShipmentBLStyle}>{blNo}</div>
          </div>

          <div className={ShipmentRightWrapperStyle}>
            <div className={ShipmentHeaderWrapperStyle}>
              <div className={ShipmentTagsWrapperStyle}>
                {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
              </div>

              <div className={ShipmentImporterWrapperStyle}>
                <div className={ShipmentImporterIconStyle}>
                  <Icon icon="IMPORTER" />
                </div>
                <div className={ShipmentImporterStyle}>{importer && importer.name}</div>
              </div>
            </div>

            <div className={ShipmentDataWrapperStyle}>
              <div className={ShipmentInChargeWrapperStyle}>
                {inCharges &&
                  inCharges.length > 0 &&
                  inCharges.map((inCharge, index) => (
                    <div key={inCharge.id} className={InChargeStyle(index)}>
                      <UserAvatar
                        firstName={inCharge.firstName}
                        lastName={inCharge.lastName}
                        width="20px"
                        height="20px"
                      />
                    </div>
                  ))}
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.lastVessel" defaultMessage="LAST VESSEL" />
                </Label>
                <div className={ShipmentBadgeStyle('80px')}>
                  {getByPathWithDefault(
                    <FormattedMessage id="components.cards.na" defaultMessage="N/A" />,
                    `${(voyages || []).length - 1}.vesselName`,
                    voyages
                  )}
                </div>
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
                </Label>
                <div className={ShipmentBadgeStyle('60px')}>
                  {totalVolume && (
                    <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
                  )}
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
                      const foundType = CONTAINER_TYPE_ITEMS.find(
                        ({ value }) => value === containerType
                      );

                      return (
                        <div className={ContainerTypeWrapperStyle} key={containerType}>
                          <div className={ContainerTypeLabelStyle}>
                            {foundType ? foundType.label : ''}
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
        <HorizontalLayout shipment={shipment} />
      </div>
    </BaseCard>
  );
};

ShipmentCard.defaultProps = defaultProps;

export default withForbiddenCard(ShipmentCard, 'shipment', {
  width: '860px',
  height: '164px',
  entityIcon: 'SHIPMENT',
  entityColor: 'SHIPMENT',
});
