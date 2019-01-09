// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { spanWithColor } from 'utils/color';
import {
  OrderInfoContainer,
  OrderTagsContainer,
  OrderItemsContainer,
} from 'modules/order/form/containers';
import validator from 'modules/order/form/validator';
import { FormField } from 'modules/form';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, DashedPlusButton, TagsInput, FormTooltip } from 'components/Form';
import {
  textInputFactory,
  textAreaFactory,
  dateInputFactory,
  selectSearchEnumInputFactory,
  customFieldsInputFactory,
} from 'modules/form/helpers';
import { getQuantitySummary } from 'modules/order/helpers';
import messages from 'modules/order/messages';
import SelectExporters from 'modules/order/common/SelectExporters';
import Icon from 'components/Icon';
import { PartnerCard } from 'components/Cards';
import UserAvatar from 'components/UserAvatar';
import AssignUsers from 'modules/shipment/form/components/TimelineSection/components/AssignUsers';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';
import TotalSummary from './components/TotalSummary';
import PriceDialog from './components/PriceDialog';
import {
  OrderSectionWrapperStyle,
  MainFieldsWrapperStyle,
  QuantitySummaryStyle,
  DividerStyle,
  DialogLineStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const OrderSection = ({ isNew }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[OrderInfoContainer]}>
      {({ originalValues: initialValues, state, setFieldValue }) => {
        const values = { ...initialValues, ...state };
        const { currency } = values;
        return (
          <>
            <div className={MainFieldsWrapperStyle}>
              <GridColumn>
                <FormField
                  name="poNo"
                  initValue={values.poNo}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      inputHandlers,
                      name,
                      isNew,
                      originalValue: initialValues[name],
                      required: true,
                      label: <FormattedMessage {...messages.PO} />,
                    })
                  }
                </FormField>
                <FormField
                  name="piNo"
                  initValue={values.piNo}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.PI} />,
                    })
                  }
                </FormField>
                <FormField
                  name="issuedAt"
                  initValue={values.issuedAt}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.date} />,
                    })
                  }
                </FormField>
                <BooleanValue>
                  {({ value: isOpen, set: setPriceDialog }) => (
                    <Subscribe to={[OrderItemsContainer]}>
                      {({ state: { orderItems }, setFieldValue: setItemFieldValue }) => (
                        <StringValue>
                          {({ value: previousCurrency, set: setPreviousCurrency }) => (
                            <>
                              <PriceDialog
                                isOpen={isOpen}
                                onRequestClose={() => {
                                  setFieldValue(
                                    'currency',
                                    previousCurrency || initialValues.currency
                                  );
                                  setPreviousCurrency(values.currency);
                                  setPriceDialog(false);
                                }}
                                onConfirm={() => {
                                  setItemFieldValue(
                                    'orderItems',
                                    orderItems.map(orderItem => ({
                                      ...orderItem,
                                      price: {
                                        ...orderItem.price,
                                        amount: 0,
                                      },
                                    }))
                                  );
                                  setPreviousCurrency(values.currency);
                                  setPriceDialog(false);
                                }}
                                onCancel={() => {
                                  setFieldValue(
                                    'currency',
                                    previousCurrency || initialValues.currency
                                  );
                                  setPreviousCurrency(values.currency);
                                  setPriceDialog(false);
                                }}
                                onDeny={() => {
                                  setPriceDialog(false);
                                  setPreviousCurrency(values.currency);
                                }}
                                message={
                                  <>
                                    <div className={DialogLineStyle}>
                                      <FormattedMessage
                                        {...messages.detectPriceChanged}
                                        values={{
                                          items: spanWithColor(
                                            <FormattedMessage {...messages.sectionItems} />,
                                            'ORDER_ITEM'
                                          ),
                                        }}
                                      />
                                    </div>
                                    <div className={DialogLineStyle}>
                                      <FormattedMessage
                                        {...messages.changePrice}
                                        values={{
                                          items: spanWithColor(
                                            <FormattedMessage {...messages.sectionItems} />,
                                            'ORDER_ITEM'
                                          ),
                                        }}
                                      />
                                    </div>
                                    <div className={DialogLineStyle}>
                                      <FormattedMessage {...messages.resetPrice} />
                                    </div>
                                  </>
                                }
                              />

                              <FormField
                                name="currency"
                                initValue={values.currency}
                                values={values}
                                validator={validator}
                                setFieldValue={setFieldValue}
                              >
                                {({ name, ...inputHandlers }) =>
                                  selectSearchEnumInputFactory({
                                    required: true,
                                    enumType: 'Currency',
                                    name,
                                    inputHandlers,
                                    isNew,
                                    originalValue: initialValues[name],
                                    event: {
                                      onBlurHasValue: (value: string) => {
                                        if (value !== values.currency) {
                                          setPriceDialog(true);
                                        } else {
                                          setPreviousCurrency(value);
                                        }
                                      },
                                    },
                                    label: <FormattedMessage {...messages.currency} />,
                                    hideClearButton: true,
                                  })
                                }
                              </FormField>
                            </>
                          )}
                        </StringValue>
                      )}
                    </Subscribe>
                  )}
                </BooleanValue>
                <FormField
                  name="incoterm"
                  initValue={values.incoterm}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    selectSearchEnumInputFactory({
                      enumType: 'Incoterm',
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.incoterm} />,
                    })
                  }
                </FormField>
                <FormField
                  name="deliveryPlace"
                  initValue={values.deliveryPlace}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.deliveryPlace} />,
                    })
                  }
                </FormField>
                {customFieldsInputFactory({
                  entityType: 'Order',
                  customFields: values.customFields,
                  setFieldValue,
                })}
              </GridColumn>

              <GridColumn gap="10px">
                <FieldItem
                  label={
                    <Label>
                      <FormattedMessage id="modules.Orders.inCharge" defaultMessage="IN CHARGE" /> (
                      {values.inCharges.length})
                    </Label>
                  }
                  tooltip={
                    <FormTooltip
                      infoMessage={
                        <FormattedMessage
                          id="modules.Orders.inChargeExplanation"
                          defaultMessage="You can choose up to 5 people in charge."
                        />
                      }
                    />
                  }
                />
                <div className={AssignmentWrapperStyle}>
                  {values &&
                    values.inCharges &&
                    values.inCharges.map(({ id, firstName, lastName }) => (
                      <div className={AssignmentStyle} key={id}>
                        <button
                          className={RemoveAssignmentButtonStyle}
                          onClick={() =>
                            setFieldValue(
                              'inCharges',
                              values.inCharges.filter(({ id: userId }) => id !== userId)
                            )
                          }
                          type="button"
                        >
                          <Icon icon="REMOVE" />
                        </button>
                        <UserAvatar firstName={firstName} lastName={lastName} />
                      </div>
                    ))}
                  {((values && !values.inCharges) ||
                    (values && values.inCharges && values.inCharges.length < 5)) && (
                    <BooleanValue>
                      {({ value: isOpen, set: slideToggle }) => (
                        <>
                          <button
                            data-testid="addAssignerButton"
                            className={AddAssignmentButtonStyle}
                            type="button"
                            onClick={() => slideToggle(true)}
                          >
                            <Icon icon="ADD" />
                          </button>
                          <SlideView
                            isOpen={isOpen}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {isOpen && (
                              <AssignUsers
                                selected={values.inCharges}
                                onSelect={selected => {
                                  slideToggle(false);
                                  setFieldValue('inCharges', selected);
                                }}
                                onCancel={() => slideToggle(false)}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
                </div>
                <Label required>
                  <FormattedMessage {...messages.exporter} />
                </Label>
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      {!values.exporter ? (
                        <DashedPlusButton
                          width="195px"
                          height="215px"
                          onClick={() => slideToggle(true)}
                        />
                      ) : (
                        <PartnerCard partner={values.exporter} onClick={() => slideToggle(true)} />
                      )}

                      <SlideView
                        isOpen={opened}
                        onRequestClose={() => slideToggle(false)}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <Subscribe to={[OrderItemsContainer]}>
                            {({ setFieldValue: resetOrderItems }) => (
                              <SelectExporters
                                selected={values.exporter}
                                onCancel={() => slideToggle(false)}
                                onSelect={newValue => {
                                  slideToggle(false);
                                  setFieldValue('exporter', newValue);
                                  resetOrderItems('orderItems', []);
                                }}
                              />
                            )}
                          </Subscribe>
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </GridColumn>
            </div>

            <Subscribe to={[OrderTagsContainer]}>
              {({ state: { tags }, setFieldValue: changeTags }) => (
                <FieldItem
                  vertical
                  label={
                    <Label>
                      <FormattedMessage {...messages.tags} />
                    </Label>
                  }
                  input={
                    <TagsInput
                      editable={isNew}
                      id="tags"
                      name="tags"
                      tagType="Order"
                      values={tags}
                      onChange={(field, value) => {
                        changeTags(field, value);
                      }}
                    />
                  }
                />
              )}
            </Subscribe>

            <FormField
              name="memo"
              initValue={values.memo}
              values={values}
              validator={validator}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textAreaFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: initialValues[name],
                  label: <FormattedMessage {...messages.memo} />,
                  vertical: true,
                  width: '680px',
                  height: '65px',
                })
              }
            </FormField>

            <div className={DividerStyle} />
            <Subscribe to={[OrderItemsContainer]}>
              {({ state: { orderItems } }) => {
                const {
                  orderedQuantity,
                  batchedQuantity,
                  shippedQuantity,
                  totalPrice,
                  totalItems,
                  activeBatches,
                  archivedBatches,
                } = getQuantitySummary(orderItems);
                return (
                  <div className={QuantitySummaryStyle}>
                    <TotalSummary
                      orderedQuantity={orderedQuantity}
                      batchedQuantity={batchedQuantity}
                      shippedQuantity={shippedQuantity}
                      currency={currency}
                      totalPrice={totalPrice}
                      totalItems={totalItems}
                      activeBatches={activeBatches}
                      archivedBatches={archivedBatches}
                    />
                  </div>
                );
              }}
            </Subscribe>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default OrderSection;
