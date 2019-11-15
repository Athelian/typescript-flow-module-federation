// @flow
import * as React from 'react';
import type { ContainerPayload } from 'generated/graphql';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { isForbidden } from 'utils/data';
import FormattedDate from 'components/FormattedDate';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import {
  Label,
  Display,
  DefaultStyle,
  TextInputFactory,
  DateTimeInputFactory,
  SelectInputFactory,
  EnumSelectInputFactory,
} from 'components/Form';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import { UserConsumer } from 'contexts/Viewer';
import { calculateDueDate } from 'utils/date';
import { calculateContainerTotalVolume } from 'modules/container/utils';
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
  ContainerTypeWrapperStyle,
  LabelInputStyle,
  DividerStyle,
  IconInputStyle,
  InputIconStyle,
  WarehouseIconStyle,
  LabelStyle,
  ApprovalIconStyle,
  TagsWrapperStyle,
} from './style';

type Props = {|
  onSelectWarehouse: Function,
  onClick: (container: mixed) => void,
  onRemove: (container: mixed) => void,
  selectable: boolean,
  editable: Object,
  actions: Array<React$Node>,
  intl: IntlShape,
  field: string,
  container: ContainerPayload,
  update: Function,
|};

const defaultProps = {
  onSelectWarehouse: () => {},
  onClick: () => {},
  onRemove: () => {},
  selectable: false,
  editable: {
    no: false,
    containerType: false,
    containerOption: false,
    warehouse: false,
    viewWarehouse: false,
    warehouseArrivalAgreedDate: false,
    warehouseArrivalAgreedDateApprovedBy: false,
    warehouseArrivalActualDate: false,
    warehouseArrivalActualDateApprovedBy: false,
  },
  actions: [],
};

const ShipmentContainerCard = ({
  intl,
  field,
  container,
  onRemove,
  onSelectWarehouse,
  update,
  selectable,
  editable,
  ...rest
}: Props) => {
  const id = getByPathWithDefault(false, 'id', container);
  const archived = getByPathWithDefault(false, 'archived', container);
  const containerType = getByPathWithDefault('', 'containerType', container);
  const containerOption = getByPathWithDefault('', 'containerOption', container);
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
  const warehouse = getByPathWithDefault(null, 'warehouse', container);
  const product = getByPathWithDefault(
    {},
    'representativeBatch.orderItem.productProvider.product',
    container
  );
  const totalVolume = calculateContainerTotalVolume(container);

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
          isArchived={archived}
          {...rest}
        >
          <div className={CardWrapperStyle} role="presentation">
            <div className={ImagePartWrapperStyle} role="presentation">
              <div className={ImageWrapperStyle}>
                <ProductImage
                  className={ImageStyle}
                  file={getByPathWithDefault(null, 'files.0', product)}
                  height="80px"
                />
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
                      inputAlign="left"
                      editable={editable.no}
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

              <div
                className={ContainerTypeWrapperStyle}
                onClick={evt => evt.stopPropagation()}
                role="presentation"
              >
                <FormField
                  name={`container.${id}.containerType`}
                  initValue={containerType}
                  values={values}
                  saveOnChange
                  setFieldValue={(name: string, value: any) => {
                    update({ ...container, containerType: value });
                  }}
                >
                  {({ name: fieldName, ...inputHandlers }) => (
                    <SelectInputFactory
                      name={fieldName}
                      inputWidth="100px"
                      inputHeight="20px"
                      inputAlign="left"
                      editable={editable.containerType}
                      items={CONTAINER_TYPE_ITEMS}
                      placeholder={intl.formatMessage({
                        id: 'components.Cards.containerTypePlaceholder',
                        defaultMessage: 'Container Type',
                      })}
                      hideTooltip
                      hideDropdownArrow
                      {...inputHandlers}
                    />
                  )}
                </FormField>

                <FormField
                  name={`container.${id}.containerOption`}
                  initValue={containerOption}
                  values={values}
                  saveOnChange
                  setFieldValue={(name: string, value: any) => {
                    update({ ...container, containerOption: value });
                  }}
                >
                  {({ name: fieldName, ...inputHandlers }) => (
                    <EnumSelectInputFactory
                      name={fieldName}
                      inputWidth="80px"
                      inputHeight="20px"
                      inputAlign="left"
                      editable={editable.containerOption}
                      enumType="ContainerOption"
                      placeholder={intl.formatMessage({
                        id: 'components.Cards.containerOptionPlaceholder',
                        defaultMessage: 'Option',
                      })}
                      hideTooltip
                      hideDropdownArrow
                      {...inputHandlers}
                    />
                  )}
                </FormField>
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
                <Display>{batches && <FormattedNumber value={batches.length} />}</Display>
              </div>

              <div className={DividerStyle} />

              <div className={IconInputStyle}>
                {warehouse &&
                  (editable.viewWarehouse ? (
                    // $FlowFixMe Flow typed is not updated yet
                    <Link
                      className={WarehouseIconStyle(true)}
                      to={`/warehouse/${encodeId(warehouse.id)}`}
                      onClick={evt => {
                        evt.stopPropagation();
                      }}
                    >
                      <Icon icon="WAREHOUSE" />
                    </Link>
                  ) : (
                    <div className={WarehouseIconStyle(true)}>
                      <Icon icon="WAREHOUSE" />
                    </div>
                  ))}

                {!warehouse && (
                  <div className={WarehouseIconStyle(false)}>
                    <Icon icon="WAREHOUSE" />
                  </div>
                )}

                {editable.warehouse ? (
                  <button
                    type="button"
                    onClick={evt => {
                      evt.stopPropagation();
                      onSelectWarehouse();
                    }}
                  >
                    <DefaultStyle type="button" width="155px" height="20px">
                      <Display blackout={isForbidden(warehouse)} align="left">
                        {isNullOrUndefined(warehouse) ? '' : warehouse.name}
                      </Display>
                    </DefaultStyle>
                  </button>
                ) : (
                  <Display blackout={isForbidden(warehouse)} align="left" width="155px">
                    {isNullOrUndefined(warehouse) ? '' : warehouse.name}
                  </Display>
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
                    <DateTimeInputFactory
                      inputWidth="165px"
                      inputHeight="20px"
                      inputAlign="left"
                      name={fieldName}
                      editable={editable.warehouseArrivalAgreedDate}
                      hideTooltip
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
                    className={ApprovalIconStyle(
                      true,
                      editable.warehouseArrivalAgreedDateApprovedBy
                    )}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (editable.warehouseArrivalAgreedDateApprovedBy) {
                        update({
                          ...container,
                          warehouseArrivalAgreedDateApprovedBy: null,
                          warehouseArrivalAgreedDateApprovedAt: null,
                        });
                      }
                    }}
                  >
                    <Icon icon="CHECKED" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={ApprovalIconStyle(
                      false,
                      editable.warehouseArrivalAgreedDateApprovedBy
                    )}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (editable.warehouseArrivalAgreedDateApprovedBy) {
                        update({
                          ...container,
                          warehouseArrivalAgreedDateApprovedBy: user,
                          warehouseArrivalAgreedDateApprovedAt: new Date(),
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
                    <DateTimeInputFactory
                      inputWidth="165px"
                      inputHeight="20px"
                      inputAlign="left"
                      name={fieldName}
                      editable={editable.warehouseArrivalActualDate}
                      hideTooltip
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
                    className={ApprovalIconStyle(
                      true,
                      editable.warehouseArrivalActualDateApprovedBy
                    )}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (editable.warehouseArrivalActualDateApprovedBy) {
                        update({
                          ...container,
                          warehouseArrivalActualDateApprovedBy: null,
                          warehouseArrivalActualDateApprovedAt: null,
                        });
                      }
                    }}
                  >
                    <Icon icon="CHECKED" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={ApprovalIconStyle(
                      false,
                      editable.warehouseArrivalActualDateApprovedBy
                    )}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (editable.warehouseArrivalActualDateApprovedBy) {
                        update({
                          ...container,
                          warehouseArrivalActualDateApprovedBy: user,
                          warehouseArrivalActualDateApprovedAt: new Date(),
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

export default injectIntl(
  withForbiddenCard(ShipmentContainerCard, 'container', {
    width: '195px',
    height: '394px',
    entityIcon: 'CONTAINER',
    entityColor: 'CONTAINER',
  })
);
