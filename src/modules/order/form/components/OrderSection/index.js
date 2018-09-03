// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, StringValue } from 'react-values';
import OrderFormContainer from 'modules/order/form/container';
import { FormContainer, FormField } from 'modules/form';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
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
  InputGroup,
} from 'components/Form';
import EnumProvider from 'providers/enum';
import matchSorter from 'match-sorter';

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

const OrderSection = ({ isNew, initialValues }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[OrderFormContainer]}>
      {({ state: values, setFieldValue, validationRules }) => {
        const totalOrderedQuantity = values.orderItems ? values.orderItems.length : 0;
        const totalBatches = values.orderItems
          ? values.orderItems.reduce((total, item) => total + item.batchItems.length, 0)
          : 0;

        return (
          <React.Fragment>
            <div className={MainFieldsWrapperStyle}>
              <InputGroup fieldGap={20}>
                <Subscribe to={[FormContainer]}>
                  {({ state: { touched, errors, activeField }, ...formHelper }) => (
                    <React.Fragment>
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
                        name="issueAt"
                        initValue={values.issuAt}
                        setFieldValue={setFieldValue}
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
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={
                              <Label>
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
                            input={
                              <EnumProvider enumType="Currency">
                                {({ loading, error, data }) => {
                                  if (loading) return null;
                                  if (error) return `Error!: ${error}`;

                                  const filterItems = (query: string, items: Array<any>) => {
                                    if (!query) return items;
                                    return matchSorter(items, query, {
                                      keys: ['name', 'description'],
                                    });
                                  };

                                  return (
                                    <StringValue defaultValue="">
                                      {({ value: query, set, clear }) => (
                                        <SearchSelectInput
                                          name={name}
                                          {...inputHandlers}
                                          items={filterItems(query, data)}
                                          itemToString={item => (item ? item.name : '')}
                                          itemToValue={item => (item ? item.id : null)}
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
                                              itemToValue={item => (item ? item.id : null)}
                                            />
                                          )}
                                          onChange={item => {
                                            if (!item) clear();
                                            setFieldValue('currency', item && item.name);
                                          }}
                                          onSearch={set}
                                        />
                                      )}
                                    </StringValue>
                                  );
                                }}
                              </EnumProvider>
                            }
                          />
                        )}
                      </FormField>

                      <FormField
                        name="deliveryPlace"
                        initValue={values.deliveryPlace}
                        setFieldValue={setFieldValue}
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
                    </React.Fragment>
                  )}
                </Subscribe>
              </InputGroup>
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
                          <SelectExporters
                            selected={values.exporter}
                            onSelect={({ group, name }) =>
                              setFieldValue('exporter', {
                                id: group.id,
                                name: name || group.name,
                              })
                            }
                          />
                        )}
                      </SlideView>
                    </React.Fragment>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
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
                    onChange={setFieldValue}
                  />
                }
              />

              <div className={DividerStyle}>
                <Divider color={colors.GRAY_LIGHT} />
              </div>
            </div>
            <div className={QuantitySummaryStyle}>
              <InputGroup fieldGap={20}>
                <Display title="ORDERED QTY">
                  <FormattedNumber value={totalOrderedQuantity} />
                </Display>
                <Display title="BATCHED QTY">
                  <FormattedNumber value={values.batchedQuantity} />
                </Display>
                <Display title="SHIPPED QTY">
                  <FormattedNumber value={values.shippedQuantity} />
                </Display>
              </InputGroup>

              <InputGroup fieldGap={20}>
                <Display title="TOTAL PRICE">
                  <FormattedNumber value={values.totalPrice} />
                </Display>
                <Display title="TOTAL ITEMS">
                  <FormattedNumber value={values.orderItems ? values.orderItems.length : 0} />
                </Display>
                <Display title="TOTAL BATCHES">
                  <FormattedNumber value={totalBatches} />
                </Display>
              </InputGroup>
            </div>
          </React.Fragment>
        );
      }}
    </Subscribe>
  </div>
);

export default OrderSection;
