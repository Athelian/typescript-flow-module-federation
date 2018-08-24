// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FormattedMessage } from 'react-intl';
import Display from 'components/Display';
import FormattedNumber from 'components/FormattedNumber';
import yupToFormErrors from 'utils/yupToFormErrors';
import {
  FieldItem,
  StyledTextInput,
  Form,
  FormObserver,
  Field,
  TextInput,
  TagsInput,
  InputGroup,
} from 'components/Form';
import CurrencyInput from 'components/Form/CurrencyInput';
import IncotermsInput from 'components/Form/IncotermsInput';
import EntityCard from 'components/EntityCard';
import Label from 'components/Label';
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
} from './style';

type Props = {
  isNew: boolean,
  onChange: Function,
  initialValues: {
    updatedAt?: Date,
    status?: string,
    PI?: string,
    PO?: string,
    currency?: string,
    incoterms?: string,
    deliveryPlace?: string,
    date?: Date,
  },
};

const OrderSchema = Yup.object().shape({
  PO: Yup.string().required(),
  currency: Yup.string().required(),
  exporter: Yup.string().required(),
});

const onValidate = (values: Object) =>
  new Promise((resolve, reject) => {
    OrderSchema.validate(values, { abortEarly: false })
      .then(() => resolve({}))
      .catch(error => reject(yupToFormErrors(error)));
  });

const OrderSection = ({ isNew, onChange, initialValues }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Form
      initialValues={initialValues}
      validateOnChange
      validateOnBlur
      validations={onValidate}
      render={({ values, errors, touched, setFieldValue }) => {
        const totalOrderedQuantity = values.items ? values.items.length : 0;
        const totalBatches = values.items
          ? values.items.reduce((total, item) => total + item.batchItems.length, 0)
          : 0;
        return (
          <React.Fragment>
            <div className={MainFieldsWrapperStyle}>
              <InputGroup fieldGap={20}>
                <Field
                  name="PO"
                  render={({ input }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.PO} />}
                      input={hasError => (
                        <StyledTextInput
                          forceHoverStyle={isNew}
                          hasError={hasError}
                          width="200px"
                          pureTextInputProps={{
                            ...input,
                          }}
                        />
                      )}
                      labelProps={{
                        required: true,
                      }}
                      tooltipProps={{
                        isNew,
                        tooltipBubbleProps: {
                          errorMessage: errors.PO,
                          changedValues: {
                            oldValue: initialValues.PO,
                            newValue: input.value,
                          },
                        },
                      }}
                    />
                  )}
                />
                <Field
                  name="PI"
                  render={({ input }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.PI} />}
                      input={hasError => (
                        <StyledTextInput
                          forceHoverStyle={isNew}
                          hasError={hasError}
                          width="200px"
                          pureTextInputProps={{
                            ...input,
                          }}
                        />
                      )}
                      tooltipProps={{
                        isNew,
                        tooltipBubbleProps: {
                          changedValues: {
                            oldValue: initialValues.PI,
                            newValue: input.value,
                          },
                        },
                      }}
                    />
                  )}
                />
                <Field
                  name="date"
                  render={({ input }) => (
                    <TextInput
                      {...input}
                      id="poDate"
                      type="date"
                      title={<FormattedMessage {...messages.date} />}
                      errorMessage={touched.date && errors.date}
                      editable={isNew}
                      width="200px"
                      onChange={setFieldValue}
                      align="right"
                    />
                  )}
                />
                {/* FIXME: enum input is wrong when send the selected value */}
                <CurrencyInput
                  title={<FormattedMessage {...messages.currency} />}
                  value={values.currency}
                  onChange={({ name }) => setFieldValue('currency', name)}
                  width="200px"
                  required
                />
                <IncotermsInput
                  title={<FormattedMessage {...messages.incoterms} />}
                  value={values.incoterms}
                  onChange={({ name }) => setFieldValue('incoterms', name)}
                  width="200px"
                />
                <Field
                  name="deliveryPlace"
                  render={({ input }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.deliveryPlace} />}
                      input={hasError => (
                        <StyledTextInput
                          forceHoverStyle={isNew}
                          hasError={hasError}
                          width="200px"
                          pureTextInputProps={{
                            ...input,
                          }}
                        />
                      )}
                      tooltipProps={{
                        isNew,
                        tooltipBubbleProps: {
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
                        <EntityCard icon="PARTNER" color="BLACK">
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
                        </EntityCard>
                        <SlideView
                          isOpen={opened}
                          onRequestClose={toggle}
                          options={{ width: '60vw' }}
                        >
                          <SelectExporters
                            selected={values.exporter}
                            onSelect={({ name, id }) => setFieldValue('exporter', { id, name })}
                          />
                        </SlideView>
                      </React.Fragment>
                    )}
                  </BooleanValue>
                </Label>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <TagsInput
                title={<FormattedMessage {...messages.tags} />}
                editable={isNew}
                id="tags"
                name="tags"
                tagType="productTags"
                value={values.tags}
                onChange={setFieldValue}
              />
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
                  <FormattedNumber value={values.items ? values.items.length : 0} />
                </Display>
                <Display title="TOTAL BATCHES">
                  <FormattedNumber value={totalBatches} />
                </Display>
              </InputGroup>
            </div>
            <FormObserver
              onChange={({ values: observeValues }) => onChange({ observeValues, onValidate })}
            />
          </React.Fragment>
        );
      }}
    />
  </div>
);

export default OrderSection;
