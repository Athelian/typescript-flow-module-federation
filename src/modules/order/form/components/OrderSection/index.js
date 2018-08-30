// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import OrderFormContainer from 'modules/order/form/container';
import { FormContainer, FormField } from 'modules/form';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import withFieldInput from 'hoc/withFieldInput';
import withCache from 'hoc/withCache';
import Display from 'components/Display';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import {
  FieldItem,
  TextInput as StyledTextInput,
  DateInput as StyledDateInput,
  DashedPlusButton,
  Field,
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

const TextInput = withFieldInput(({ isActive, isNew, hasError, ...input }) => (
  <StyledTextInput
    isFocused={isActive}
    forceHoverStyle={isNew}
    hasError={hasError}
    width="200px"
    pureInputOptions={{
      ...input,
    }}
  />
));

const DateInput = withFieldInput(({ isActive, isNew, hasError, ...input }) => (
  <StyledDateInput
    isFocused={isActive}
    forceHoverStyle={isNew}
    hasError={hasError}
    width="200px"
    pureInputOptions={{
      ...input,
    }}
  />
));

const Currency = withFieldInput(({ isActive, isNew, hasError, ...input }) => (
  <CurrencyInput
    isFocused={isActive}
    forceHoverStyle={isNew}
    hasError={hasError}
    width="200px"
    pureInputOptions={{
      ...input,
    }}
  />
));

const CacheFieldItem = withCache(FieldItem, ['isActive', 'error', 'value']);

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
                      <CacheFieldItem
                        error={touched.poNo && errors.poNo}
                        value={values.poNo}
                        isActive={activeField === 'poNo'}
                        label={<FormattedMessage {...messages.PO} />}
                        input={hasError => (
                          <FormField
                            name="poNo"
                            initValue={values.poNo}
                            onFinish={value => setFieldValue('poNo', value)}
                            validationOnChange
                            onValidate={newValue =>
                              formHelper.onValidation({ ...values, ...newValue }, validationRules())
                            }
                            {...formHelper}
                          >
                            {({ value, onChange, ...inputHandlers }) => (
                              <StyledTextInput
                                forceHoverStyle={isNew}
                                isFocused={activeField === 'poNo'}
                                error={touched.poNo && errors.poNo}
                                hasError={hasError}
                                width="200px"
                                pureInputOptions={{
                                  name: 'PoNo',
                                  value,
                                  onChange: evt => onChange(evt.target.value),
                                  ...inputHandlers,
                                }}
                              />
                            )}
                          </FormField>
                        )}
                        labelOptions={{
                          required: true,
                        }}
                        tooltipOptions={{
                          isNew,
                          tooltipBubbleOptions: {
                            errorMessage: errors.poNo,
                            changedValues: {
                              oldValue: initialValues.poNo,
                              newValue: values.poNo,
                            },
                          },
                        }}
                      />
                      <CacheFieldItem
                        error={errors.piNo}
                        value={values.piNo}
                        isActive={activeField === 'piNo'}
                        label={<FormattedMessage {...messages.PI} />}
                        input={hasError => (
                          <TextInput
                            name="piNo"
                            value={values.piNo}
                            isNew={isNew}
                            isActive={activeField === 'piNo'}
                            error={errors.piNo}
                            hasError={hasError}
                            width="200px"
                            {...formHelper}
                            setFieldValue={setFieldValue}
                          />
                        )}
                        labelOptions={{
                          required: false,
                        }}
                        tooltipOptions={{
                          isNew,
                          tooltipBubbleOptions: {
                            errorMessage: errors.piNo,
                            changedValues: {
                              oldValue: initialValues.piNo,
                              newValue: values.piNo,
                            },
                          },
                        }}
                      />
                      <CacheFieldItem
                        error={errors.issueAt}
                        value={values.issueAt}
                        isActive={activeField === 'poNo'}
                        label={<FormattedMessage {...messages.date} />}
                        input={hasError => (
                          <DateInput
                            name="issueAt"
                            value={values.issueAt}
                            isNew={isNew}
                            isActive={activeField === 'issueAt'}
                            error={errors.issueAt}
                            hasError={hasError}
                            width="200px"
                            setFieldValue={setFieldValue}
                            {...formHelper}
                          />
                        )}
                        labelOptions={{
                          required: false,
                        }}
                        tooltipOptions={{
                          isNew,
                          tooltipBubbleOptions: {
                            errorMessage: errors.issueAt,
                            changedValues: {
                              oldValue: <FormattedDate value={initialValues.issueAt} />,
                              newValue: <FormattedDate value={values.issueAt} />,
                            },
                          },
                        }}
                      />

                      <CacheFieldItem
                        label={<FormattedMessage {...messages.currency} />}
                        input={hasError => (
                          <Currency
                            name="currency"
                            value={values.currency}
                            isNew={isNew}
                            required
                            isActive={activeField === 'currency'}
                            error={errors.currency}
                            hasError={hasError}
                            onChange={value => setFieldValue('currency', value)}
                            width="200px"
                            setFieldValue={setFieldValue}
                            {...formHelper}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </Subscribe>

                <Field
                  name="incoterm"
                  render={({ input, meta }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.incoterms} />}
                      input={hasError => (
                        <IncotermInput
                          value={values.incoterm}
                          onChange={value => setFieldValue('incoterm', value)}
                          width="200px"
                          forceHoverStyle={isNew}
                          isFocused={meta.isActive}
                          hasError={hasError}
                          pureInputOptions={{
                            ...input,
                          }}
                        />
                      )}
                    />
                  )}
                />
                <Field
                  name="deliveryPlace"
                  render={({ input, meta }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.deliveryPlace} />}
                      input={hasError => (
                        <StyledTextInput
                          isFocused={meta.isActive}
                          forceHoverStyle={isNew}
                          hasError={hasError}
                          width="200px"
                          pureInputOptions={{
                            ...input,
                          }}
                        />
                      )}
                      tooltipOptions={{
                        isNew,
                        tooltipBubbleOptions: {
                          changedValues: {
                            oldValue: initialValues.deliveryPlace,
                            newValue: input.value,
                          },
                        },
                      }}
                    />
                  )}
                />
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
