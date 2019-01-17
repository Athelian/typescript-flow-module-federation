// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FormField } from 'modules/form';
import { textInputFactory, dateTimeInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  CardWrapperStyle,
  ImagePartWrapperStyle,
  CardImageStyle,
  CardInfoWrapperStyle,
  CardNameStyle,
  CardSerialStyle,
  InfoPartWrapperStyle,
  TextInputStyle,
  BasicCardItemStyle,
  InputWithIconStyle,
  DividerStyle,
  IconWithInputStyle,
  WarehouseIconStyle,
  ApprovalIconStyle,
  CardTagsWrapperStyle,
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
    representativeBatch: {
      orderItem: {
        productProvider: { product },
      },
    },
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
          <img className={CardImageStyle} src={productImage} alt="product_image" />

          <div className={CardInfoWrapperStyle}>
            <div className={CardNameStyle}>{product.name}</div>
            <div className={CardSerialStyle}>{product.serial}</div>
          </div>
        </div>

        <div className={InfoPartWrapperStyle}>
          <div
            className={TextInputStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
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
                      saveOnBlur({ ...container, no: inputHandlers.value });
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

          <div className={BasicCardItemStyle}>
            <Label>
              <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
            </Label>
            <Display align="right">
              <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />
            </Display>
          </div>

          <div className={BasicCardItemStyle}>
            <Label>
              <FormattedMessage id="components.cards.batches" defaultMessage="BATCHES" />
            </Label>
            <Display align="right">
              <FormattedNumber value={batches.length} />
            </Display>
          </div>

          <div className={DividerStyle} />

          <div className={IconWithInputStyle}>
            <div className={WarehouseIconStyle(!!warehouse)}>
              <Icon icon="WAREHOUSE" />
            </div>
            {/* clicking, open slide view */}
            <Display align="right">{warehouse.name}</Display>
          </div>

          <div>
            <Label>
              <FormattedMessage
                id="components.cards.agreedArrival"
                defaultMessage="AGREED ARRIVAL"
              />
            </Label>
          </div>
          <div
            className={InputWithIconStyle}
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
                      saveOnBlur({
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

          <div>
            <Label>
              <FormattedMessage
                id="components.cards.actualArrival"
                defaultMessage="ACTUAL ARRIVAL"
              />
            </Label>
          </div>
          <div
            className={InputWithIconStyle}
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
                      saveOnBlur({
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

          <div className={CardTagsWrapperStyle}>
            {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentContainerCard.defaultProps = defaultProps;

export default ShipmentContainerCard;
