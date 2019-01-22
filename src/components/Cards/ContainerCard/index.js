// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { Label, Display } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
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
  LabelInputStyle,
  DividerStyle,
  IconInputStyle,
  InputIconStyle,
  WarehouseIconStyle,
  LabelStyle,
  ApprovalIconStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  actions: [],
};

const ContainerCard = ({ container, ...rest }: Props) => {
  if (!container) return '';
  const {
    representativeBatch,
    shipment,
    id,
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
  return (
    <BaseCard icon="CONTAINER" color="CONTAINER" {...rest}>
      <div
        className={CardWrapperStyle}
        onClick={() => navigate(`/container/${encodeId(id)}`)}
        role="presentation"
      >
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
            <Display align="left">{warehouse.name}</Display>
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

ContainerCard.defaultProps = defaultProps;

export default ContainerCard;
