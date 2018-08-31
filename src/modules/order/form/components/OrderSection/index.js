// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import OrderFormContainer from 'modules/order/form/container';
import { FormContainer, FormField } from 'modules/form';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import Display from 'components/Display';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import {
  FieldItem,
  TextInput,
  DateInput,
  DashedPlusButton,
  TagsInput,
  InputGroup,
  CurrencyInput,
  IncotermInput,
} from 'components/Form';
import Divider from 'components/Divider';
import BaseCard from 'components/Cards';
import Label from 'components/Label';
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
                            label={<FormattedMessage {...messages.PO} />}
                            input={hasError => (
                              <TextInput
                                forceHoverStyle={isNew}
                                isFocused={activeField === name}
                                error={touched[name] && errors[name]}
                                hasError={hasError}
                                width="200px"
                                pureInputOptions={{
                                  name,
                                  ...inputHandlers,
                                }}
                              />
                            )}
                            labelOptions={{
                              required: true,
                            }}
                            tooltipOptions={{
                              isNew,
                              tooltipBubbleOptions: {
                                errorMessage: touched[name] && errors[name],
                                changedValues: {
                                  oldValue: initialValues[name],
                                  newValue: values[name],
                                },
                              },
                            }}
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
                            label={<FormattedMessage {...messages.PI} />}
                            input={() => (
                              <TextInput
                                forceHoverStyle={isNew}
                                isFocused={activeField === name}
                                width="200px"
                                pureInputOptions={{
                                  name,
                                  ...inputHandlers,
                                }}
                              />
                            )}
                            tooltipOptions={{
                              isNew,
                              tooltipBubbleOptions: {
                                changedValues: {
                                  oldValue: initialValues[name],
                                  newValue: values[name],
                                },
                              },
                            }}
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
                            label={<FormattedMessage {...messages.date} />}
                            input={() => (
                              <DateInput
                                forceHoverStyle={isNew}
                                isFocused={activeField === name}
                                width="200px"
                                pureInputOptions={{
                                  name,
                                  ...inputHandlers,
                                }}
                              />
                            )}
                            tooltipOptions={{
                              isNew,
                              tooltipBubbleOptions: {
                                changedValues: {
                                  oldValue: <FormattedDate value={initialValues[name]} />,
                                  newValue: <FormattedDate value={values[name]} />,
                                },
                              },
                            }}
                          />
                        )}
                      </FormField>

                      <FieldItem
                        label={<FormattedMessage {...messages.currency} />}
                        input={hasError => (
                          <CurrencyInput
                            name="currency"
                            value={values.currency}
                            isNew={isNew}
                            required
                            isActive={activeField === 'currency'}
                            error={errors.currency}
                            hasError={hasError}
                            onChange={value => setFieldValue('currency', value)}
                            width="200px"
                            {...formHelper}
                          />
                        )}
                      />

                      <FieldItem
                        label={<FormattedMessage {...messages.incoterms} />}
                        input={hasError => (
                          <IncotermInput
                            name="incoterm"
                            value={values.incoterm}
                            isNew={isNew}
                            required
                            isActive={activeField === 'incoterm'}
                            error={errors.incoterm}
                            hasError={hasError}
                            onChange={value => setFieldValue('incoterm', value)}
                            width="200px"
                            {...formHelper}
                          />
                        )}
                      />

                      <FormField
                        name="deliveryPlace"
                        initValue={values.deliveryPlace}
                        setFieldValue={setFieldValue}
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={<FormattedMessage {...messages.deliveryPlace} />}
                            input={() => (
                              <TextInput
                                forceHoverStyle={isNew}
                                isFocused={activeField === name}
                                width="200px"
                                pureInputOptions={{
                                  name,
                                  ...inputHandlers,
                                }}
                              />
                            )}
                            tooltipOptions={{
                              isNew,
                              tooltipBubbleOptions: {
                                changedValues: {
                                  oldValue: initialValues[name],
                                  newValue: values[name],
                                },
                              },
                            }}
                          />
                        )}
                      </FormField>
                    </React.Fragment>
                  )}
                </Subscribe>
              </InputGroup>
              <div className={ExporterSectionStyle}>
                <Label title={<FormattedMessage {...messages.exporter} />} required vertical>
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
                </Label>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <FieldItem
                vertical
                label={<FormattedMessage {...messages.tags} />}
                input={() => (
                  <TagsInput
                    editable={isNew}
                    id="tags"
                    name="tags"
                    tagType="Order"
                    values={values.tags}
                    onChange={setFieldValue}
                  />
                )}
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
