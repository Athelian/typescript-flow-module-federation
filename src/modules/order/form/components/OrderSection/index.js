// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import {
  OrderInfoContainer,
  OrderTagsContainer,
  OrderItemsContainer,
} from 'modules/order/form/containers';
import { FormContainer, FormField } from 'modules/form';
import SlideView from 'components/SlideView';
import FormattedDate from 'components/FormattedDate';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  TextInput,
  DateInput,
  DashedPlusButton,
  TagsInput,
} from 'components/Form';
import { enumSearchSelectInputFactory } from 'modules/form/helpers';
import Divider from 'components/Divider';
import BaseCard from 'components/Cards';
import { colors } from 'styles/common';
import messages from 'modules/order/messages';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import SelectExporters from '../SelectExporters';
import TotalSummary from './components/TotalSummary';
import {
  OrderSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ExporterSectionStyle,
  ExporterCardStyle,
  ExporterCardImageStyle,
  ExporterNameStyle,
  TagsInputStyle,
  QuantitySummaryStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

function getQuantitySummary(orderItems: any) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let totalPrice = 0;
  let totalItems = 0;
  let activeBatches = 0;
  let archivedBatches = 0;

  if (orderItems) {
    totalItems = orderItems.length;

    orderItems.forEach(item => {
      const qty = item.quantity ? item.quantity : 0;
      const price = item.price ? item.price.amount : 0;
      orderedQuantity += qty;
      totalPrice += price * qty;

      if (item.batches) {
        item.batches.forEach(batch => {
          batchedQuantity += batch.quantity;
          if (batch.batchAdjustments) {
            batch.batchAdjustments.forEach(batchAdjustment => {
              batchedQuantity -= batchAdjustment.quantity;
            });
          }
          if (batch.shipment) {
            shippedQuantity += batch.quantity;
          }
          if (batch.archived) {
            archivedBatches += 1;
          } else {
            activeBatches += 1;
          }
        });
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    totalPrice,
    totalItems,
    activeBatches,
    archivedBatches,
  };
}
const OrderSection = ({ isNew }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[OrderInfoContainer]}>
      {({ originalValues: initialValues, state, setFieldValue, validationRules }) => {
        const values = { ...initialValues, ...state };
        const { currency } = values;

        return (
          <>
            <div className={MainFieldsWrapperStyle}>
              <Subscribe to={[FormContainer]}>
                {({ state: { touched, errors, activeField }, ...formHelper }) => (
                  <GridColumn>
                    <FormField
                      name="poNo"
                      initValue={values.poNo}
                      validationOnChange
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      setFieldValue={setFieldValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label required>
                              <FormattedMessage {...messages.PO} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              errorMessage={touched[name] && errors[name]}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              isFocused={activeField === name}
                              hasError={touched[name] && errors[name]}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <TextInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="piNo"
                      initValue={values.piNo}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.PI} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              isFocused={activeField === name}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <TextInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="issuedAt"
                      initValue={values.issuedAt}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.date} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: <FormattedDate value={initialValues[name]} />,
                                newValue: <FormattedDate value={values[name]} />,
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              type="date"
                              isFocused={activeField === name}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <DateInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="currency"
                      initValue={values.currency}
                      setFieldValue={setFieldValue}
                      validationOnChange
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label required>
                              <FormattedMessage {...messages.currency} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              errorMessage={touched[name] && errors[name]}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={enumSearchSelectInputFactory({
                            enumType: 'Currency',
                            inputHandlers,
                            name,
                            touched,
                            errors,
                            isNew,
                            activeField,
                          })}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="incoterm"
                      initValue={values.incoterm}
                      setFieldValue={setFieldValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.incoterm} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={enumSearchSelectInputFactory({
                            enumType: 'Incoterm',
                            inputHandlers,
                            name,
                            touched,
                            errors,
                            isNew,
                            activeField,
                          })}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="deliveryPlace"
                      initValue={values.deliveryPlace}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.deliveryPlace} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              isFocused={activeField === name}
                              hasError={touched[name] && errors[name]}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <TextInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>
                  </GridColumn>
                )}
              </Subscribe>
              <div className={ExporterSectionStyle}>
                <Label required>
                  <FormattedMessage {...messages.exporter} />
                </Label>
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <>
                      {!values.exporter ? (
                        <DashedPlusButton width="200px" height="230px" onClick={toggle} />
                      ) : (
                        <BaseCard icon="PARTNER" color="PARTNER">
                          <div className={ExporterCardStyle} role="presentation" onClick={toggle}>
                            <img
                              className={ExporterCardImageStyle}
                              src={FALLBACK_IMAGE}
                              alt="exporter_image"
                            />
                            <div className={ExporterNameStyle}>
                              {values.exporter && values.exporter.id
                                ? values.exporter.name
                                : 'Exporter'}
                            </div>
                          </div>
                        </BaseCard>
                      )}

                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <Subscribe to={[FormContainer, OrderItemsContainer]}>
                            {(
                              { onValidation, setFieldTouched },
                              { setFieldValue: resetOrderItems }
                            ) => (
                              <SelectExporters
                                selected={values.exporter}
                                onCancel={toggle}
                                onSelect={newValue => {
                                  toggle();
                                  setFieldTouched('exporter');
                                  setFieldValue('exporter', newValue);
                                  resetOrderItems('orderItems', []);
                                  onValidation(
                                    {
                                      ...values,
                                      exporter: newValue,
                                    },
                                    validationRules()
                                  );
                                }}
                              />
                            )}
                          </Subscribe>
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <Subscribe to={[FormContainer, OrderTagsContainer]}>
                {(
                  { setFieldTouched, onValidation },
                  { state: { tags }, setFieldValue: changeTags }
                ) => (
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
                          setFieldTouched('tags');
                          onValidation(
                            {
                              ...values,
                            },
                            validationRules()
                          );
                        }}
                      />
                    }
                  />
                )}
              </Subscribe>
              <div className={DividerStyle}>
                <Divider color={colors.GRAY_LIGHT} />
              </div>
            </div>
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
