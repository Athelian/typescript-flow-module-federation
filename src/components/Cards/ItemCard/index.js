// @flow
import * as React from 'react';
import type {
  OrderPayload,
  OrderItemPayload,
  BatchPayload,
  ProductProviderPayload,
  ProductPayload,
} from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { times } from 'utils/number';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import TaskRing from 'components/TaskRing';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, FieldItem, NumberInputFactory, TextInputFactory } from 'components/Form';
import { getItemQuantityChartData } from 'utils/item';
import withForbiddenCard from 'hoc/withForbiddenCard';
import RelateEntity from 'components/RelateEntity';
import BaseCard from '../BaseCard';
import {
  OrderItemCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameWrapperStyle,
  ProductIconLinkStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductProviderNameStyle,
  ProductTagsWrapperStyle,
  BodyWrapperStyle,
  NoWrapperStyle,
  QuantityWrapperStyle,
  UnitPriceWrapperStyle,
  SyncButtonStyle,
  DividerStyle,
  ChartWrapperStyle,
  TotalPriceWrapperStyle,
  OrderWrapperStyle,
  ImporterWrapperStyle,
  TagsAndTaskWrapperStyle,
  ItemTagsWrapperStyle,
} from './style';
import validator from './validator';

type Props = {
  order: OrderPayload,
  batches: Array<BatchPayload>,
  index: number,
  actions: Array<React$Node>,
  setFieldValue: (path: string, value: mixed) => void,
  onClick: Function,
  editable: {
    quantity: boolean,
    price: boolean,
  },
  viewable: {
    price: boolean,
  },
  navigable: {
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
  orderItem: OrderItemPayload,
  productProvider: ProductProviderPayload,
  product: ProductPayload,
};

const defaultProps = {
  order: {
    id: '',
    poNo: '',
  },
  batches: [],
  index: 0,
  actions: [],
  setFieldValue: () => {},
  onClick: () => {},
  selectable: false,
  selected: false,
  onSelect: () => {},
  readOnly: false,
};

const editableDefault = {
  no: false,
  quantity: false,
  price: false,
};

const viewableDefault = {
  price: false,
};

const navigableDefault = {
  product: false,
  order: false,
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
  navigable,
  config,
  ...rest
}: Props) => {
  const archived = getByPathWithDefault(false, 'archived', orderItem);
  const no = getByPathWithDefault('', 'no', orderItem);
  const quantity = getByPathWithDefault(0, 'quantity', orderItem);
  const price = getByPathWithDefault(null, 'price', orderItem);
  const tags = getByPathWithDefault([], 'tags', orderItem);
  const todo = getByPathWithDefault(null, 'todo', orderItem);

  const orderId = getByPathWithDefault('', 'id', order);
  const poNo = getByPathWithDefault('', 'poNo', order);
  const orderCurrency = getByPathWithDefault('', 'currency', order);
  const importer = getByPathWithDefault(null, 'importer', order);
  const exporter = getByPathWithDefault(null, 'exporter', order);

  const validation = validator({
    no: `orderItems.${index}.no`,
    quantity: `orderItems.${index}.quantity`,
    price: `orderItems.${index}.price`,
  });

  const values = {
    [`orderItems.${index}.no`]: no,
    [`orderItems.${index}.quantity`]: quantity,
    [`orderItems.${index}.price`]: price,
    orderCurrency,
  };

  const productProviderName = getByPathWithDefault('', 'name', productProvider);
  const productUnitPrice = getByPathWithDefault(null, 'unitPrice', productProvider);

  const productId = getByPathWithDefault('', 'id', product);
  const productName = getByPathWithDefault('', 'name', product);
  const productSerial = getByPathWithDefault('', 'serial', product);
  const productTags = getByPathWithDefault([], 'tags', product);

  const quantityChartData = getItemQuantityChartData({ orderItem, batches });

  /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
   * v0.111.0. To view the error, delete this comment and run Flow. */
  const mergedEditable = { ...editableDefault, ...editable };
  const mergedViewable = { ...viewableDefault, ...viewable };
  const mergedNavigable = { ...navigableDefault, ...navigable };
  const mergedConfig = { ...configDefault, ...config };

  if (!mergedConfig.hideOrder) cardHeight += 71;

  return (
    <BaseCard
      showBadge={getByPathWithDefault(0, 'timeline.unreadCount', orderItem) > 0}
      icon="ORDER_ITEM"
      color="ORDER_ITEM"
      showActionsOnHover
      isArchived={archived}
      {...rest}
    >
      <div className={OrderItemCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ProductWrapperStyle}>
          <ProductImage
            className={ProductImageStyle}
            height="95px"
            file={getByPathWithDefault(null, 'files.0', product)}
          />
          <div className={ProductInfoWrapperStyle}>
            {productId && (
              <>
                <div className={ProductNameWrapperStyle}>
                  {mergedNavigable.product ? (
                    // $FlowFixMe Flow typed is not updated yet
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
                    <div className={ProductIconLinkStyle}>
                      <Icon icon="PRODUCT" />
                    </div>
                  )}

                  <div className={ProductNameStyle}>{productName}</div>
                </div>

                <div className={ProductSerialStyle}>{productSerial}</div>

                <div className={ProductProviderNameStyle}>
                  <Icon icon="PRODUCT_PROVIDER" />
                  {productProviderName}
                </div>

                <div className={ProductTagsWrapperStyle}>
                  {productTags && productTags.map(tag => <Tag key={tag.id} tag={tag} />)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={BodyWrapperStyle}>
          <div
            className={NoWrapperStyle}
            onClick={evt => {
              if (mergedEditable.no) {
                evt.stopPropagation();
              }
            }}
            role="presentation"
          >
            <FormField
              name={`orderItems.${index}.no`}
              initValue={no}
              setFieldValue={setFieldValue}
              values={values}
              validator={validation}
            >
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
            onClick={evt => {
              if (mergedEditable.quantity) {
                evt.stopPropagation();
              }
            }}
            role="presentation"
          >
            <FormField
              name={`orderItems.${index}.quantity`}
              initValue={quantity}
              setFieldValue={setFieldValue}
              values={values}
              validator={validation}
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
            onClick={evt => {
              if (mergedEditable.price) {
                evt.stopPropagation();
              }
            }}
            role="presentation"
          >
            <FormField
              name={`orderItems.${index}.price.amount`}
              initValue={price.amount}
              setFieldValue={setFieldValue}
              values={values}
              validator={validation}
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
            <>
              <div className={OrderWrapperStyle}>
                <RelateEntity
                  link={mergedNavigable.order ? `/order/${encodeId(orderId)}` : ''}
                  entity="ORDER"
                  value={poNo}
                />
              </div>
              <div className={ImporterWrapperStyle}>
                <Icon icon="IMPORTER" />
                {importer && importer.name}
              </div>
              <div className={ImporterWrapperStyle}>
                <Icon icon="EXPORTER" />
                {exporter && exporter.name}
              </div>
            </>
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
