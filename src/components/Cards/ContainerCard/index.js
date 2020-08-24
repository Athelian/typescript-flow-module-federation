// @flow
import * as React from 'react';
import type { ContainerPayload, UserPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import { defaultVolumeMetric } from 'utils/metric';
import { isForbidden } from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import FormattedDateTZ from 'components/FormattedDateTZ';
import RelateEntity from 'components/RelateEntity';
import { Label, Display } from 'components/Form';
import { FullValueTooltip, Tooltip } from 'components/Tooltip';
import Divider from 'components/Divider';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { calculateDueDate } from 'utils/date';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';
import { CONTAINER_TYPE_MAP } from 'modules/container/constants';
import { getMaxVolume } from 'utils/container';
import BaseCard from '../BaseCard';
import {
  CardWrapperStyle,
  ImagePartWrapperStyle,
  ImageWrapperStyle,
  ImageStyle,
  InfoInsideImageWrapperStyle,
  NameStyle,
  SerialStyle,
  InfoPartWrapperStyle,
  InputStyle,
  ContainerTypeWrapperStyle,
  LabelInputStyle,
  DividerStyle,
  IconInputStyle,
  InputIconStyle,
  LabelStyle,
  ApprovalIconStyle,
  ContainerImporterWrapperStyle,
  ContainerImporterIconStyle,
  ContainerImporterStyle,
  TagsWrapperStyle,
} from './style';

type Props = {|
  container: ContainerPayload,
  onClick?: Function,
  user: UserPayload,
|};

const defaultProps = {
  onClick: () => {},
};

const ContainerCard = ({ container, onClick, user, ...rest }: Props) => {
  const archived = getByPathWithDefault(false, 'archived', container);
  const containerType = getByPathWithDefault('', 'containerType', container);
  const containerOption = getByPathWithDefault('', 'containerOption', container);
  const totalVolume = getByPathWithDefault(
    {
      metric: defaultVolumeMetric,
      value: 0,
    },
    'totalVolume',
    container
  );
  const no = getByPathWithDefault('', 'no', container);
  const warehouseArrivalAgreedDate = getByPathWithDefault(
    '',
    'warehouseArrivalAgreedDate',
    container
  );
  const warehouseArrivalActualDate = getByPathWithDefault(
    '',
    'warehouseArrivalActualDate',
    container
  );
  const tags = getByPathWithDefault([], 'tags', container);
  const batches = getByPathWithDefault([], 'batches', container);
  const warehouseArrivalAgreedDateApprovedBy = getByPathWithDefault(
    null,
    'warehouseArrivalAgreedDateApprovedBy',
    container
  );
  const warehouseArrivalActualDateApprovedBy = getByPathWithDefault(
    null,
    'warehouseArrivalActualDateApprovedBy',
    container
  );
  const freeTimeDuration = getByPathWithDefault(null, 'freeTimeDuration', container);
  const freeTimeStartDate = getByPathWithDefault(null, 'freeTimeStartDate', container);
  const shipment = getByPathWithDefault(null, 'shipment', container);
  const warehouse = getByPathWithDefault(null, 'warehouse', container);
  const product = getByPathWithDefault(
    {},
    'representativeBatch.orderItem.productProvider.product',
    container
  );

  const maxVolumeValue = getMaxVolume(containerType);

  return (
    <BaseCard
      icon="CONTAINER"
      color="CONTAINER"
      isArchived={archived}
      showBadge={container?.notificationUnseenCount > 0}
      {...rest}
    >
      <div className={CardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ImagePartWrapperStyle}>
          <div className={ImageWrapperStyle}>
            <ProductImage
              className={ImageStyle}
              height="75px"
              file={getByPathWithDefault(null, 'files.0', product)}
            />
          </div>
          <div className={InfoInsideImageWrapperStyle}>
            <div className={NameStyle}>{product.name}</div>
            <div className={SerialStyle}>{product.serial}</div>
          </div>
        </div>

        <div className={InfoPartWrapperStyle}>
          <FullValueTooltip message={no}>
            <div className={InputStyle}>
              <Display align="left">{no}</Display>
            </div>
          </FullValueTooltip>

          <div className={ContainerTypeWrapperStyle}>
            <Display align="left">{CONTAINER_TYPE_MAP[containerType]}</Display>
            <Display align="left">{containerOption}</Display>
          </div>

          <div className={LabelInputStyle}>
            <Label>
              <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
            </Label>
            <Display>
              {totalVolume && (
                <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
              )}
            </Display>
          </div>

          <div className={LabelInputStyle}>
            <Label>
              <FormattedMessage id="components.cards.loadingRate" defaultMessage="Loading %" />
            </Label>
            <Display>
              <Tooltip
                message={
                  maxVolumeValue ? (
                    <>
                      <FormattedMessage
                        id="module.container.loadingRateCalculation"
                        defaultMessage="(Total Volume / Max Volume) * 100%"
                      />
                      <Divider />
                      <FormattedMessage
                        id="module.container.loadingRateCalculationValues"
                        defaultMessage="({totalVolume}m³ / {maxVolume}m³) * 100%"
                        values={{
                          totalVolume: totalVolume.value,
                          maxVolume: maxVolumeValue,
                        }}
                      />
                    </>
                  ) : (
                    <FormattedMessage
                      id="module.container.loadingRateTooltip"
                      defaultMessage="Please choose a Container Type in order to calculate this value"
                    />
                  )
                }
              >
                <span>
                  {maxVolumeValue ? (
                    <FormattedNumber
                      value={(totalVolume.value / maxVolumeValue) * 100}
                      suffix="%"
                    />
                  ) : (
                    <FormattedMessage id="components.cards.na" />
                  )}
                </span>
              </Tooltip>
            </Display>
          </div>

          <div className={LabelInputStyle}>
            <Label>
              <FormattedMessage id="components.cards.batches" defaultMessage="BATCHES" />
            </Label>
            <Display>
              <FormattedNumber value={batches.length} />
            </Display>
          </div>

          <div className={DividerStyle} />

          <div className={IconInputStyle}>
            <PartnerPermissionsWrapper data={warehouse}>
              {permissions => (
                <RelateEntity
                  blackout={isForbidden(warehouse)}
                  link={
                    permissions.includes(WAREHOUSE_FORM)
                      ? `/warehouse/${encodeId(warehouse.id)}`
                      : ''
                  }
                  entity="WAREHOUSE"
                  value={
                    warehouse && (
                      <FullValueTooltip message={warehouse.name}>
                        <span>{warehouse.name}</span>
                      </FullValueTooltip>
                    )
                  }
                />
              )}
            </PartnerPermissionsWrapper>
          </div>

          <div className={LabelStyle}>
            <Label>
              <FormattedMessage
                id="components.cards.agreedArrival"
                defaultMessage="AGREED ARRIVAL"
              />
            </Label>
          </div>
          <div className={InputIconStyle}>
            <Display align="left">
              <FormattedDateTZ value={warehouseArrivalAgreedDate} user={user} showTime />
            </Display>
            <div className={ApprovalIconStyle(!!warehouseArrivalAgreedDateApprovedBy)}>
              <Icon icon="CHECKED" />
            </div>
          </div>

          <div className={LabelStyle}>
            <Label>
              <FormattedMessage
                id="components.cards.actualArrival"
                defaultMessage="ACTUAL ARRIVAL"
              />
            </Label>
          </div>
          <div className={InputIconStyle}>
            <Display align="left">
              <FormattedDateTZ value={warehouseArrivalActualDate} user={user} showTime />
            </Display>
            <div className={ApprovalIconStyle(!!warehouseArrivalActualDateApprovedBy)}>
              <Icon icon="CHECKED" />
            </div>
          </div>

          <div className={LabelStyle}>
            <Label>
              <FormattedMessage id="components.cards.due" defaultMessage="DUE DATE" />
            </Label>
          </div>
          <div className={InputIconStyle}>
            <Display align="left">
              {freeTimeStartDate && freeTimeDuration ? (
                <FormattedDate value={calculateDueDate(freeTimeStartDate, freeTimeDuration)} />
              ) : (
                <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
              )}
            </Display>
          </div>
          <div className={DividerStyle} />

          <div className={IconInputStyle}>
            <RelateEntity
              link={shipment && shipment.id ? `/shipment/${encodeId(shipment.id)}` : ''}
              blackout={isForbidden(shipment)}
              entity="SHIPMENT"
              value={shipment && shipment.no}
            />
          </div>

          <div className={ContainerImporterWrapperStyle}>
            <div className={ContainerImporterIconStyle}>
              <Icon icon="IMPORTER" />
            </div>
            <div className={ContainerImporterStyle}>
              {shipment && shipment.importer && (
                <FullValueTooltip message={shipment.importer.name}>
                  <span>{shipment.importer.name}</span>
                </FullValueTooltip>
              )}
            </div>
          </div>
          <div className={TagsWrapperStyle}>
            {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ContainerCard.defaultProps = defaultProps;

export default withForbiddenCard(ContainerCard, 'container', {
  width: '195px',
  height: '473px',
  entityIcon: 'CONTAINER',
  entityColor: 'CONTAINER',
});
