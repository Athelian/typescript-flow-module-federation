// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { Label, Display } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
import BaseCard, { CardAction } from '../BaseCard';
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
  LabelInputStyle,
  DividerStyle,
  IconInputStyle,
  InputIconStyle,
  WarehouseIconStyle,
  WarehouseNameWrapperStyle,
  LabelStyle,
  // WarehouseSelectButtonStyle,
  ApprovalIconStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (container: Object) => void,
  onClone: (container: Object) => void,
  onClear: (container: Object) => void,
  selectable: boolean,
};

type Props = OptionalProps & {
  container: Object,
  currency: string,
  saveOnBlur: Function,
};

const defaultProps = {
  onClick: () => {},
  onClone: () => {},
  onClear: () => {},
  selectable: false,
};

const ShipmentContainerCard = ({
  container,
  onClick,
  onClear,
  onClone,
  saveOnBlur,
  currency,
  selectable,
  ...rest
}: Props) => {
  if (!container) return '';

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => onClone(container)} />,
        <CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(container)} />,
      ];

  const {
    representativeBatch,
    shipment,
    no,
    totalVolume,
    batches,
    warehouse,
    warehouseArrivalAgreedDate,
    warehouseArrivalAgreedDateApprovedBy,
    warehouseArrivalActualDate,
    warehouseArrivalActualDateApprovedBy,
    tags,
  } = container;
  const product = getByPathWithDefault(
    {},
    'orderItem.productProvider.product',
    representativeBatch
  );
  const productImage = getProductImage(product);

  const newContainer = {
    ...container,
    no,
    totalVolume,
    warehouseArrivalAgreedDate,
    warehouseArrivalActualDate,
  };

  return (
    <BaseCard
      icon="CONTAINER"
      color="CONTAINER"
      showActionsOnHover
      actions={actions}
      selectable={selectable}
      {...rest}
    >
      <div className={CardWrapperStyle} onClick={() => onClick(newContainer)} role="presentation">
        <div
          className={ImagePartWrapperStyle}
          onClick={() => onClick(newContainer)}
          role="presentation"
        >
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

          <div className={LabelInputStyle}>
            <Label>
              <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
            </Label>
            <Display align="right">
              <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
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
            <Link
              className={WarehouseIconStyle(!!warehouse)}
              to={`/warehouse/${encodeId(warehouse.id)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="WAREHOUSE" />
            </Link>
            <div className={WarehouseNameWrapperStyle}>
              <Display align="left">{warehouse.name}</Display>
            </div>
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
              <FormattedDate
                value={warehouseArrivalAgreedDate}
                mode="datetime"
                timeFormat={{ hour12: false }}
              />
            </Display>
            <div className={ApprovalIconStyle(!!warehouseArrivalAgreedDateApprovedBy)}>
              {warehouseArrivalAgreedDateApprovedBy ? (
                <Icon icon="CHECKED" />
              ) : (
                <Icon icon="UNCHECKED" />
              )}
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
              <FormattedDate
                value={warehouseArrivalAgreedDate}
                mode="datetime"
                timeFormat={{ hour12: false }}
              />
            </Display>
            <div className={ApprovalIconStyle(!!warehouseArrivalActualDateApprovedBy)}>
              {warehouseArrivalActualDateApprovedBy ? (
                <Icon icon="CHECKED" />
              ) : (
                <Icon icon="UNCHECKED" />
              )}
            </div>
          </div>
          <div className={DividerStyle} />
          <div className={IconInputStyle}>
            <Link
              className={WarehouseIconStyle(!!shipment)}
              to={`/shipment/${encodeId(shipment.id)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="SHIPMENT" />
            </Link>
            <Display align="left">{shipment ? shipment.no : ''}</Display>
          </div>
          <div className={TagsWrapperStyle}>
            {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentContainerCard.defaultProps = defaultProps;

export default ShipmentContainerCard;
