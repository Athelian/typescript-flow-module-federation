// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, DefaultStyle, TextInputFactory, DateInputFactory } from 'components/Form';

import { getProductImage } from 'components/Cards/utils';
import { UserConsumer } from 'modules/user';
import validator from './validator';
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
  onSelectWarehouse: Function,
  onClick: (container: Object) => void,
  onRemove: (container: Object) => void,
  selectable: boolean,
  readOnly: boolean,
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  field: string,
  container: Object,
  update: Function,
};

const defaultProps = {
  onSelectWarehouse: () => {},
  onClick: () => {},
  onRemove: () => {},
  selectable: false,
  readOnly: false,
  actions: [],
};

const ShipmentContainerCard = ({
  field,
  container,
  onRemove,
  onSelectWarehouse,
  update,
  selectable,
  readOnly,
  ...rest
}: Props) => {
  if (!container) return '';

  const {
    representativeBatch,
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

  const validation = validator({
    no: `container.${id}.no`,
  });

  const values = {
    [`container.${id}.no`]: no,
  };

  return (
    <UserConsumer>
      {({ user }) => (
        <BaseCard
          icon="CONTAINER"
          color="CONTAINER"
          showActionsOnHover
          selectable={selectable}
          {...rest}
        >
          <div className={CardWrapperStyle} role="presentation">
            <div className={ImagePartWrapperStyle} role="presentation">
              <div className={ImageWrapperStyle}>
                <img className={ImageStyle} src={productImage} alt="product_image" />
              </div>
              <div className={InfoInsideImageWrapperStyle}>
                <div className={NameStyle}>{product.name}</div>
                <div className={SerialStyle}>{product.serial}</div>
              </div>
            </div>

            <div className={InfoPartWrapperStyle}>
              <div
                className={InputStyle}
                onClick={evt => evt.stopPropagation()}
                role="presentation"
              >
                <FormField
                  name={`container.${id}.no`}
                  initValue={no}
                  validator={validation}
                  values={values}
                >
                  {({ name: fieldName, ...inputHandlers }) => (
                    <TextInputFactory
                      inputWidth="185px"
                      inputHeight="20px"
                      editable={!readOnly}
                      {...{
                        ...inputHandlers,
                        onBlur: evt => {
                          inputHandlers.onBlur(evt);
                          update({ ...container, no: inputHandlers.value });
                        },
                      }}
                      name={fieldName}
                      isNew={false}
                      originalValue={no}
                    />
                  )}
                </FormField>
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
                  {batches && <FormattedNumber value={batches.length} />}
                </Display>
              </div>

              <div className={DividerStyle} />

              <div className={IconInputStyle}>
                {/* TODO: add warehouse style for read only */}
                {isNullOrUndefined(warehouse) ? (
                  <div className={WarehouseIconStyle(false)}>
                    <Icon icon="WAREHOUSE" />
                  </div>
                ) : (
                  <Link
                    className={WarehouseIconStyle(true)}
                    to={`/warehouse/${encodeId(warehouse.id)}`}
                    onClick={evt => {
                      evt.stopPropagation();
                    }}
                  >
                    <Icon icon="WAREHOUSE" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={evt => {
                    evt.stopPropagation();
                    onSelectWarehouse();
                  }}
                >
                  <DefaultStyle type="button" inputHeight="20px">
                    <Display align="left">
                      {isNullOrUndefined(warehouse) ? '' : warehouse.name}
                    </Display>
                  </DefaultStyle>
                </button>
              </div>

              <div className={LabelStyle}>
                <Label>
                  <FormattedMessage
                    id="components.cards.agreedArrival"
                    defaultMessage="AGREED ARRIVAL"
                  />
                </Label>
              </div>
              <div
                className={InputIconStyle}
                onClick={evt => evt.stopPropagation()}
                role="presentation"
              >
                <FormField
                  name={`container.${id}.warehouseArrivalAgreedDate`}
                  initValue={warehouseArrivalAgreedDate}
                >
                  {({ name: fieldName, ...inputHandlers }) => (
                    <DateInputFactory
                      inputWidth="165px"
                      inputHeight="20px"
                      name={fieldName}
                      editable={!readOnly}
                      isNew={false}
                      originalValue={warehouseArrivalAgreedDate}
                      {...{
                        ...inputHandlers,
                        onBlur: evt => {
                          inputHandlers.onBlur(evt);
                          update({
                            ...container,
                            warehouseArrivalAgreedDate: inputHandlers.value
                              ? inputHandlers.value
                              : null,
                          });
                        },
                      }}
                    />
                  )}
                </FormField>

                {warehouseArrivalAgreedDateApprovedBy ? (
                  <button
                    type="button"
                    className={ApprovalIconStyle(true)}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (!readOnly) {
                        update({
                          ...container,
                          warehouseArrivalAgreedDateApprovedBy: null,
                        });
                      }
                    }}
                  >
                    <Icon icon="CHECKED" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={ApprovalIconStyle(false)}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (!readOnly) {
                        update({
                          ...container,
                          warehouseArrivalAgreedDateApprovedBy: user,
                        });
                      }
                    }}
                  >
                    <Icon icon="UNCHECKED" />
                  </button>
                )}
              </div>

              <div className={LabelStyle}>
                <Label>
                  <FormattedMessage
                    id="components.cards.actualArrival"
                    defaultMessage="ACTUAL ARRIVAL"
                  />
                </Label>
              </div>
              <div
                className={InputIconStyle}
                onClick={evt => evt.stopPropagation()}
                role="presentation"
              >
                <FormField
                  name={`container.${id}.warehouseArrivalActualDate`}
                  initValue={warehouseArrivalActualDate}
                >
                  {({ name: fieldName, ...inputHandlers }) => (
                    <DateInputFactory
                      inputWidth="165px"
                      inputHeight="20px"
                      name={fieldName}
                      isNew={false}
                      editable={!readOnly}
                      originalValue={warehouseArrivalActualDate}
                      {...{
                        ...inputHandlers,
                        onBlur: evt => {
                          inputHandlers.onBlur(evt);
                          update({
                            ...container,
                            warehouseArrivalActualDate: inputHandlers.value
                              ? inputHandlers.value
                              : null,
                          });
                        },
                      }}
                    />
                  )}
                </FormField>

                {warehouseArrivalActualDateApprovedBy ? (
                  <button
                    type="button"
                    className={ApprovalIconStyle(true)}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (!readOnly) {
                        update({
                          ...container,
                          warehouseArrivalActualDateApprovedBy: null,
                        });
                      }
                    }}
                  >
                    <Icon icon="CHECKED" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={ApprovalIconStyle(false)}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (!readOnly) {
                        update({
                          ...container,
                          warehouseArrivalActualDateApprovedBy: user,
                        });
                      }
                    }}
                  >
                    <Icon icon="UNCHECKED" />
                  </button>
                )}
              </div>

              <div className={TagsWrapperStyle}>
                {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
              </div>
            </div>
          </div>
        </BaseCard>
      )}
    </UserConsumer>
  );
};

ShipmentContainerCard.defaultProps = defaultProps;

export default ShipmentContainerCard;
