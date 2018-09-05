// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import matchSorter from 'match-sorter';
import logger from 'utils/logger';
import OrderFormContainer from 'modules/order/form/container';
import { FormContainer, FormField } from 'modules/form';
import SlideView from 'components/SlideView';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  Display,
  Tooltip,
  DefaultStyle,
  TextInput,
  DateInput,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
  DashedPlusButton,
  TagsInput,
} from 'components/Form';
import EnumProvider from 'providers/enum';
import Divider from 'components/Divider';
import BaseCard from 'components/Cards';
import { colors } from 'styles/common';
import messages from 'modules/order/messages';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import SelectExporters from '../SelectExporters';
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
  initialValues: Object,
};

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

function createSelectInput({ enumType, inputHandlers, name, touched, errors, isNew, activeField }) {
  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;
        return (
          <StringValue
            defaultValue={inputHandlers.value}
            onChange={newValue =>
              inputHandlers.onChange({
                target: {
                  value: newValue || '',
                },
              })
            }
          >
            {({ value: query, set, clear }) => (
              <SearchSelectInput
                name={name}
                {...inputHandlers}
                items={filterItems(query, data)}
                itemToString={item => (item ? item.name : '')}
                itemToValue={item => (item ? item.name : '')}
                renderSelect={({ ...rest }) => (
                  <DefaultSearchSelect
                    {...rest}
                    hasError={touched[name] && errors[name]}
                    forceHoverStyle={isNew}
                    width="200px"
                    isOpen={activeField === name}
                  />
                )}
                renderOptions={({ ...rest }) => (
                  <DefaultOptions
                    {...rest}
                    items={filterItems(query, data)}
                    itemToString={item => (item ? item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                  />
                )}
                onChange={item => {
                  logger.warn('SearchSelectInput onChange', item);
                  if (!item) clear();
                  set(item && item.name);
                }}
                onBlur={inputHandlers.onBlur}
                onFocus={inputHandlers.onFocus}
                onSearch={set}
              />
            )}
          </StringValue>
        );
      }}
    </EnumProvider>
  );
}

const OrderSection = ({ isNew, initialValues }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[OrderFormContainer]}>
      {({ state, setFieldValue, validationRules }) => {
        const values = { ...initialValues, ...state };
        const totalOrderedQuantity = values.orderItems ? values.orderItems.length : 0;
        const totalBatches = values.orderItems
          ? values.orderItems.reduce(
              (total, item) => (total + item.batches ? item.batches.length : 0),
              0
            )
          : 0;

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
                          input={createSelectInput({
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
                          input={createSelectInput({
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
                    <React.Fragment>
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
                          <Subscribe to={[FormContainer]}>
                            {({ onValidation }) => (
                              <SelectExporters
                                selected={values.exporter}
                                onCancel={toggle}
                                onSelect={newValue => {
                                  toggle();
                                  setFieldValue('exporter', newValue);
                                  setFieldValue('orderItems', []);
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
                    </React.Fragment>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <Subscribe to={[FormContainer]}>
                {({ state: formState, ...formHelper }) => (
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
                        values={values.tags}
                        onChange={(field, tags) => {
                          setFieldValue(field, tags);
                          formHelper.setFieldTouched('tags');
                          formHelper.onValidation(values, validationRules());
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
            <div className={QuantitySummaryStyle}>
              <GridColumn>
                <FieldItem
                  label={<Label>ORDERED QTY</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={totalOrderedQuantity} />
                    </Display>
                  }
                />
                <FieldItem
                  label={<Label>BATCHED QTY</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={values.batchedQuantity} />
                    </Display>
                  }
                />
                <FieldItem
                  label={<Label>SHIPPED QTY</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={values.shippedQuantity} />
                    </Display>
                  }
                />
              </GridColumn>

              <GridColumn>
                <FieldItem
                  label={<Label>TOTAL PRICE</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={values.totalPrice} />
                    </Display>
                  }
                />
                <FieldItem
                  label={<Label>TOTAL ITEMS</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={values.orderItems ? values.orderItems.length : 0} />
                    </Display>
                  }
                />
                <FieldItem
                  label={<Label>TOTAL BATCHES</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={totalBatches} />
                    </Display>
                  }
                />
              </GridColumn>
            </div>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default OrderSection;
