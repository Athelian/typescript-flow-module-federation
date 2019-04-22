// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { times } from 'number-precision';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import TaskRing from 'components/TaskRing';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, FieldItem, NumberInputFactory, TextInputFactory } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
import { getItemQuantityChartData } from 'utils/item';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  OrderItemCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductPartnerStyle,
  ProductTagsWrapperStyle,
  ProductIconLinkStyle,
  BodyWrapperStyle,
  NoWrapperStyle,
  QuantityWrapperStyle,
  UnitPriceWrapperStyle,
  SyncButtonStyle,
  DividerStyle,
  ChartWrapperStyle,
  TotalPriceWrapperStyle,
  OrderWrapperStyle,
  OrderIconStyle,
  TagsAndTaskWrapperStyle,
  ItemTagsWrapperStyle,
} from './style';

type OptionalProps = {
  batches: Array<{
    quantity: number,
    batchAdjustments: Array<{
      quantity: number,
    }>,
    shipment: ?Object,
  }>,
  index: number,
  actions: Array<React.Node>,
  setFieldValue: (path: string, value: any) => void,
  onClick: Function,
  editable: {
    quantity: boolean,
    price: boolean,
  },
  viewable: {
    price: boolean,
  },
  navigate: {
    product: boolean,
    order: boolean,
  },
  config: {
    hideOrder: boolean,
  },
  selectable: boolean,
  selected: boolean,
  onSelect: Function,
  readOnly: boolean,
};

type Props = OptionalProps & {
  orderItem: {
    id: string,
    no: string,
    quantity: number,
    price: {
      amount: number,
      currency: string,
    },
    tags: ?Array<{
      id: string,
      name: string,
      color: string,
    }>,
    todo: {},
    totalBatched?: number,
    totalShipped?: number,
    batchCount?: number,
    batchShippedCount?: number,
  },
  order: {
    id: string,
    poNo: string,
    currency?: string,
  },
  productProvider: {
    exporter: {
      name: string,
    },
    supplier: ?{
      name: string,
    },
    unitPrice: ?{
      amount: number,
      currency: string,
    },
  },
  product: {
    id: string,
    name: string,
    serial: string,
    tags: ?Array<{
      id: string,
      name: string,
      color: string,
    }>,
    files: ?Array<{
      pathMedium: string,
    }>,
  },
};

const defaultProps = {
  order: null,
  batches: [],
  index: 0,
  actions: [],
  setFieldValue: () => {},
  onClick: () => {},
  selectable: false,
  selected: false,
  onSelect: () => {},
  readOnly: false,
  navigate: {
    product: false,
    order: false,
  },
};

const editableDefault = {
  no: false,
  quantity: false,
  price: false,
};

const viewableDefault = {
  price: false,
};

const configDefault = {
  hideOrder: false,
};

let cardHeight = 287;

const ItemCard = ({
  orderItem,
  productProvider,
  product,
  order,
  batches,
  index,
  setFieldValue,
  onClick,
  editable,
  viewable,
  config,
  navigate,
  ...rest
}: Props) => {
  const { no, quantity, price, tags, todo } = orderItem;

  const { id: orderId, poNo, currency: orderCurrency } = order;

  const {
    exporter: { name: exporterName },
  } = productProvider;
  const supplierName = getByPathWithDefault(null, 'supplier.name', productProvider);
  const productUnitPrice = getByPathWithDefault(null, 'unitPrice', productProvider);

  const { id: productId, name: productName, serial: productSerial, tags: productTags } = product;
  const productImage = getProductImage(product);

  const quantityChartData = getItemQuantityChartData({ orderItem, batches });

  const mergedEditable = { ...editableDefault, ...editable };
  const mergedViewable = { ...viewableDefault, ...viewable };
  const mergedConfig = { ...configDefault, ...config };
  if (!mergedConfig.hideOrder) cardHeight += 25;

  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" showActionsOnHover {...rest}>
      <div className={OrderItemCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ProductWrapperStyle}>
          <img className={ProductImageStyle} src={productImage} alt="product_image" />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameStyle}>{productName}</div>
            <div className={ProductSerialStyle}>{productSerial}</div>
            <div className={ProductPartnerStyle}>
              <Icon icon="EXPORTER" />
              {exporterName}
            </div>
            <div className={ProductPartnerStyle}>
              <Icon icon="SUPPLIER" />
              {supplierName}
            </div>
            <div className={ProductTagsWrapperStyle}>
              {productTags && productTags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>

          <button className={ProductIconLinkStyle} type="button">
            <Icon icon="PRODUCT" />
          </button>
          {navigate.product ? (
            <Link
              className={ProductIconLinkStyle}
              to={`/product/${encodeId(productId)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="PRODUCT" />
            </Link>
          ) : (
            <Icon icon="PRODUCT" />
          )}
        </div>

        <div className={BodyWrapperStyle}>
          <div
            className={NoWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <FormField name={`orderItems.${index}.no`} initValue={no} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) => (
                <TextInputFactory
                  name={name}
                  {...inputHandlers}
                  editable={mergedEditable.no}
                  inputWidth="185px"
                  inputHeight="20px"
                  inputAlign="left"
                  hideTooltip
                  required
                />
              )}
            </FormField>
          </div>

          <div
            className={QuantityWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <FormField
              name={`orderItems.${index}.quantity`}
              initValue={quantity}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) => (
                <NumberInputFactory
                  name={name}
                  {...inputHandlers}
                  editable={mergedEditable.quantity}
                  inputWidth="90px"
                  inputHeight="20px"
                  hideTooltip
                  required
                  label={<FormattedMessage id="components.cards.qty" defaultMessage="QTY" />}
                  labelWidth="90px"
                  labelHeight="20px"
                />
              )}
            </FormField>
          </div>

          <div
            className={UnitPriceWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <FormField
              name={`orderItems.${index}.price.amount`}
              initValue={price.amount}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) => (
                <NumberInputFactory
                  name={name}
                  {...inputHandlers}
                  editable={mergedEditable.price}
                  blackout={!mergedViewable.price}
                  inputWidth="90px"
                  inputHeight="20px"
                  hideTooltip
                  required
                  label={<FormattedMessage id="components.cards.price" defaultMessage="PRICE" />}
                  labelWidth="90px"
                  labelHeight="20px"
                  suffix={orderCurrency}
                />
              )}
            </FormField>

            {mergedEditable.price && (
              <button
                className={SyncButtonStyle}
                type="button"
                onClick={() => {
                  if (productUnitPrice) {
                    if (productUnitPrice.currency === orderCurrency) {
                      setFieldValue(`orderItems.${index}.price.amount`, productUnitPrice.amount);
                    }
                  }
                }}
              >
                <FormattedMessage id="components.cards.sync" defaultMessage="SYNC" />
                <Icon icon="SYNC" />
              </button>
            )}
          </div>

          <div className={DividerStyle} />

          <div className={ChartWrapperStyle}>
            <QuantityChart hasLabel={false} {...quantityChartData} />
          </div>

          <div className={TotalPriceWrapperStyle}>
            <FieldItem
              label={
                <Label>
                  <FormattedMessage id="components.cards.total" defaultMessage="TOTAL" />
                </Label>
              }
              input={
                <Display blackout={!mergedViewable.price} width="90px">
                  <FormattedNumber
                    value={times(price.amount, quantity)}
                    suffix={orderCurrency || price.currency}
                  />
                </Display>
              }
            />
          </div>

          {!mergedConfig.hideOrder && (
            <div className={OrderWrapperStyle}>
              {navigate.order ? (
                <Link
                  className={OrderIconStyle}
                  to={`/order/${encodeId(orderId)}`}
                  onClick={evt => {
                    evt.stopPropagation();
                  }}
                >
                  <Icon icon="ORDER" />
                </Link>
              ) : (
                <Icon icon="ORDER" />
              )}

              <Display align="left">{poNo}</Display>
            </div>
          )}

          <div className={TagsAndTaskWrapperStyle}>
            <div className={ItemTagsWrapperStyle}>
              {tags && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ItemCard.defaultProps = defaultProps;

export default withForbiddenCard(ItemCard, 'orderItem', {
  width: '195px',
  height: `${cardHeight}px`,
  entityIcon: 'ORDER_ITEM',
  entityColor: 'ORDER_ITEM',
});
