// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import { FormField } from 'modules/form';
import { textInputFactory, dateTimeInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, DefaultStyle } from 'components/Form';
import SlideView from 'components/SlideView';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import { getProductImage } from 'components/Cards/utils';
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
  // WarehouseSelectButtonStyle,
  ApprovalIconStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (container: Object) => void,
  onRemove: (container: Object) => void,
  selectable: boolean,
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  container: Object,
  update: Function,
};

const defaultProps = {
  onClick: () => {},
  onRemove: () => {},
  selectable: false,
  actions: [],
};

const ShipmentContainerCard = ({
  container,
  onClick,
  onRemove,
  update,
  selectable,
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
          <div className={InputStyle} onClick={evt => evt.stopPropagation()} role="presentation">
            <FormField
              name={`container.${id}.no`}
              initValue={no}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) =>
                textInputFactory({
                  width: '185px',
                  height: '20px',
                  inputHandlers: {
                    ...inputHandlers,
                    onBlur: evt => {
                      inputHandlers.onBlur(evt);
                      update({ ...container, no: inputHandlers.value });
                    },
                  },
                  name: fieldName,
                  isNew: false,
                  originalValue: no,
                  align: 'left',
                })
              }
            </FormField>
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
            <BooleanValue>
              {({ value: isOpenSelectWarehouse, set: toggleSelectWarehouse }) => (
                <>
                  <button type="button" onClick={() => toggleSelectWarehouse(true)}>
                    <DefaultStyle type="button" height="20px">
                      <Display align="left">
                        {isNullOrUndefined(warehouse) ? '' : warehouse.name}
                      </Display>
                    </DefaultStyle>
                  </button>

                  <SlideView
                    isOpen={isOpenSelectWarehouse}
                    onRequestClose={() => toggleSelectWarehouse(false)}
                    options={{ width: '1030px' }}
                  >
                    {isOpenSelectWarehouse && (
                      <SelectWareHouse
                        selected={warehouse}
                        onCancel={() => toggleSelectWarehouse(false)}
                        onSelect={newValue => {
                          toggleSelectWarehouse(false);
                          update({
                            ...container,
                            warehouse: newValue,
                          });
                        }}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
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
              {({ name: fieldName, ...inputHandlers }) =>
                dateTimeInputFactory({
                  width: '165px',
                  height: '20px',
                  name: fieldName,
                  isNew: false,
                  originalValue: warehouseArrivalAgreedDate,
                  inputHandlers: {
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
                  },
                })
              }
            </FormField>
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
          <div
            className={InputIconStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <FormField
              name={`container.${id}.warehouseArrivalActualDate`}
              initValue={warehouseArrivalActualDate}
            >
              {({ name: fieldName, ...inputHandlers }) =>
                dateTimeInputFactory({
                  width: '165px',
                  height: '20px',
                  name: fieldName,
                  isNew: false,
                  originalValue: warehouseArrivalActualDate,
                  inputHandlers: {
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
                  },
                })
              }
            </FormField>
            <div className={ApprovalIconStyle(!!warehouseArrivalActualDateApprovedBy)}>
              {warehouseArrivalActualDateApprovedBy ? (
                <Icon icon="CHECKED" />
              ) : (
                <Icon icon="UNCHECKED" />
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

ShipmentContainerCard.defaultProps = defaultProps;

export default ShipmentContainerCard;
