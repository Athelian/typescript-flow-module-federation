// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FormattedMessage } from 'react-intl';
import yupToFormErrors from 'utils/yupToFormErrors';
import { Form, Field, TextInput, TagsInput, NumberInput, InputGroup } from 'components/Form';
import CurrencyInput from 'components/Form/CurrencyInput';
import IncotermsInput from 'components/Form/IncotermsInput';
import EntityCard from 'components/EntityCard';
import Label from 'components/Label';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import SelectExporters from '../SelectExporters';
import {
  WrapperStyle,
  FormWrapperStyle,
  InputsWrapperStyle,
  ExporterSectionStyle,
  ExporterCardStyle,
  TagsInputStyle,
  QuantitySummaryStyle,
} from './style';
import messages from './messages';

type Props = {
  isNew: boolean,
  onSubmit: (values: Object) => void,
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

const OrderSection = ({ isNew, onSubmit, initialValues }: Props) => (
  <div className={WrapperStyle}>
    <Form
      initialValues={initialValues}
      validateOnChange
      validateOnBlur
      validations={onValidate}
      onSubmit={onSubmit}
      render={({ values, errors, touched, setFieldValue }) => {
        const totalOrderedQuantity = values.items ? values.items.length : 0;
        const totalBatches = values.items
          ? values.items.reduce((total, item) => total + item.batchItems.length, 0)
          : 0;

        return (
          <div>
            <div className={FormWrapperStyle}>
              <div className={InputsWrapperStyle}>
                <InputGroup fieldGap={16}>
                  <Field
                    name="PO"
                    render={({ input }) => (
                      <TextInput
                        {...input}
                        id="PO"
                        label="PO NO"
                        title={<FormattedMessage {...messages.PO} />}
                        errorMessage={touched.NO && errors.NO}
                        required
                        editable={isNew}
                        width="200px"
                        defaultHover
                        onChange={setFieldValue}
                        horizontal
                      />
                    )}
                  />
                  <Field
                    name="PI"
                    render={({ input }) => (
                      <TextInput
                        {...input}
                        id="PI"
                        label="PI NO"
                        title={<FormattedMessage {...messages.PI} />}
                        errorMessage={touched.PI && errors.PI}
                        editable={isNew}
                        width="200px"
                        defaultHover
                        onChange={setFieldValue}
                        horizontal
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
                        label="PO ISSUANCE DATE"
                        title={<FormattedMessage {...messages.date} />}
                        errorMessage={touched.date && errors.date}
                        editable={isNew}
                        width="200px"
                        defaultHover
                        onChange={setFieldValue}
                        horizontal
                      />
                    )}
                  />
                  <CurrencyInput
                    title={<FormattedMessage {...messages.currency} />}
                    value={values.currency}
                    onChange={v => setFieldValue('currency', v)}
                    horizontal
                    width="200px"
                    required
                    defaultHover
                  />
                  <IncotermsInput
                    title={<FormattedMessage {...messages.incoterms} />}
                    value={values.incoterms}
                    onChange={v => setFieldValue('incoterms', v)}
                    horizontal
                    width="200px"
                    required
                    defaultHover
                  />
                  <Field
                    name="deliveryPlace"
                    render={({ input }) => (
                      <TextInput
                        {...input}
                        id="deliveryPlace"
                        label="PLACE OF DELIVERY"
                        title={<FormattedMessage {...messages.deliveryPlace} />}
                        errorMessage={touched.deliveryPlace && errors.deliveryPlace}
                        editable={isNew}
                        defaultHover
                        width="200px"
                        onChange={setFieldValue}
                        horizontal
                      />
                    )}
                  />
                </InputGroup>
              </div>
              <div className={ExporterSectionStyle}>
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <React.Fragment>
                      <div role="presentation" onClick={toggle}>
                        <Label title={<FormattedMessage {...messages.exporter} />} required>
                          <div style={{ marginTop: '10px' }} />
                          <EntityCard icon="PARTNER" color="BLACK">
                            <div className={ExporterCardStyle}>
                              <img src={FALLBACK_IMAGE} alt="exporter_image" />
                              <div>ExporterA</div>
                            </div>
                          </EntityCard>
                        </Label>
                      </div>
                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '60vw' }}
                      >
                        <SelectExporters />
                      </SlideView>
                    </React.Fragment>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <TagsInput
                title={<FormattedMessage {...messages.tags} />}
                editable={isNew}
                label="TAGS"
                id="tags"
                name="tags"
                tagType="productTags"
                value={values.tags}
                onChange={setFieldValue}
              />
            </div>
            <div className={QuantitySummaryStyle}>
              <InputGroup fieldGap={16}>
                <NumberInput
                  label={<FormattedMessage {...messages.totalOrderedQuantity} />}
                  value={totalOrderedQuantity}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
                <NumberInput
                  label={<FormattedMessage {...messages.batchedQuantity} />}
                  value={values.batchedQuantity || 0}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
                <NumberInput
                  label={<FormattedMessage {...messages.shippedQuantity} />}
                  value={values.shippedQuantity || 0}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
              </InputGroup>
              <InputGroup fieldGap={16}>
                <NumberInput
                  value={values.totalPrice || 0}
                  label={<FormattedMessage {...messages.totalOrderPrice} />}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
                <NumberInput
                  value={values.items ? values.items.length : 0}
                  label={<FormattedMessage {...messages.totalOrderedQuantity} />}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
                <NumberInput
                  label={<FormattedMessage {...messages.totalBatchedQuantity} />}
                  value={totalBatches}
                  width="200px"
                  align="right"
                  readOnly
                  horizontal
                />
              </InputGroup>
            </div>
          </div>
        );
      }}
    />
  </div>
);

export default OrderSection;
