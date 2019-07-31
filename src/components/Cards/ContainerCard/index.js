// @flow
import * as React from 'react';
import type { ContainerPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import { defaultVolumeMetric } from 'utils/metric';
import { getSelectLabel, isForbidden } from 'utils/data';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import RelateEntity from 'components/RelateEntity';
import { Label, Display } from 'components/Form';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { calculateDueDate } from 'modules/container/utils';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
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
|};

const defaultProps = {
  onClick: () => {},
};

const ContainerCard = ({ container, onClick, ...rest }: Props) => {
  const archived = getByPathWithDefault(false, 'archived', container);
  const containerType = getByPathWithDefault('', 'containerType', container);
  const containerOption = getByPathWithDefault('', 'containerOption', container);
  const totalVolume = getByPathWithDefault(
    {
      metric: defaultVolumeMetric,
      value: 0,
    },
    'desiredAt',
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
  return (
    <BaseCard icon="CONTAINER" color="CONTAINER" isArchived={archived} {...rest}>
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
          <div className={InputStyle}>
            <Display align="left">{no}</Display>
          </div>

          <div className={ContainerTypeWrapperStyle}>
            <Display align="left">{getSelectLabel(containerType, CONTAINER_TYPE_ITEMS)}</Display>
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
                  blackout={isNullOrUndefined(warehouse) || isForbidden(warehouse)}
                  link={
                    permissions.includes(WAREHOUSE_FORM)
                      ? `/warehouse/${encodeId(warehouse.id)}`
                      : ''
                  }
                  entity="WAREHOUSE"
                  value={warehouse && warehouse.name}
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
              <FormattedDate value={warehouseArrivalAgreedDate} mode="datetime" />
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
              <FormattedDate value={warehouseArrivalActualDate} mode="datetime" />
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
              {isNullOrUndefined(freeTimeStartDate) ||
              freeTimeStartDate === '' ||
              isNullOrUndefined(freeTimeDuration) ? (
                <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
              ) : (
                <FormattedDate value={calculateDueDate(freeTimeStartDate, freeTimeDuration)} />
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
              {shipment && shipment.importer && shipment.importer.name}
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
  height: '448px',
  entityIcon: 'CONTAINER',
  entityColor: 'CONTAINER',
});
