// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { getSelectLabel, isForbidden } from 'utils/data';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import RelateEntity from 'components/RelateEntity';
import { Label, Display } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
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
  WarehouseIconStyle,
  LabelStyle,
  ApprovalIconStyle,
  ContainerImporterWrapperStyle,
  ContainerImporterIconStyle,
  ContainerImporterStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  onClick: () => {},
};

const ContainerCard = ({ container, onClick, ...rest }: Props) => {
  const {
    representativeBatch,
    shipment,
    archived,
    no,
    containerType,
    containerOption,
    totalVolume,
    batches,
    warehouse,
    warehouseArrivalAgreedDate,
    warehouseArrivalAgreedDateApprovedBy,
    warehouseArrivalActualDate,
    warehouseArrivalActualDateApprovedBy,
    freeTimeStartDate,
    freeTimeDuration,
    tags,
  } = container;
  const product = getByPathWithDefault(
    {},
    'orderItem.productProvider.product',
    representativeBatch
  );
  const productImage = getProductImage(product);
  return (
    <BaseCard icon="CONTAINER" color="CONTAINER" isArchived={archived} {...rest}>
      <div className={CardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ImagePartWrapperStyle}>
          <div className={ImageWrapperStyle}>
            <img className={ImageStyle} src={productImage} alt="product_image" />
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
            <Display align="right">
              {totalVolume && (
                <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
              )}
            </Display>
          </div>

          <div className={LabelInputStyle}>
            <Label>
              <FormattedMessage id="components.cards.batches" defaultMessage="BATCHES" />
            </Label>
            <Display align="right">
              <FormattedNumber value={batches.length} />
            </Display>
          </div>

          <div className={DividerStyle} />

          <div className={IconInputStyle}>
            {isNullOrUndefined(warehouse) ? (
              <div className={WarehouseIconStyle(false)}>
                <Icon icon="WAREHOUSE" />
              </div>
            ) : (
              <>
                {isForbidden(warehouse) ? (
                  <>
                    <div className={WarehouseIconStyle(true)} role="presentation">
                      <Icon icon="WAREHOUSE" />
                    </div>
                    <Display blackout={isForbidden(warehouse)} align="left" />
                  </>
                ) : (
                  <>
                    <PartnerPermissionsWrapper data={warehouse}>
                      {permissions => (
                        <Link
                          className={WarehouseIconStyle(true)}
                          to={
                            permissions.includes(WAREHOUSE_FORM)
                              ? `/warehouse/${encodeId(warehouse.id)}`
                              : ''
                          }
                          onClick={evt => {
                            evt.stopPropagation();
                          }}
                        >
                          <Icon icon="WAREHOUSE" />
                        </Link>
                      )}
                    </PartnerPermissionsWrapper>
                    <Display align="left">{warehouse.name}</Display>
                  </>
                )}
              </>
            )}
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
            {isNullOrUndefined(shipment) ? (
              <RelateEntity entity="SHIPMENT" value="" />
            ) : (
              <>
                <Link
                  to={`/shipment/${encodeId(shipment.id)}`}
                  onClick={evt => {
                    evt.stopPropagation();
                  }}
                >
                  <RelateEntity
                    blackout={isForbidden(shipment)}
                    entity="SHIPMENT"
                    value={shipment && shipment.no}
                  />
                </Link>
              </>
            )}
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
