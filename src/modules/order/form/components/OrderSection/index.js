// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
// import UserAvatar from 'components/UserAvatar';
import { FormattedMessage } from 'react-intl';
import yupToFormErrors from 'utils/yupToFormErrors';
import { Form, Field, TextInput, TagsInput, InputGroup } from 'components/Form';
import CurrencyInput from 'components/Form/CurrencyInput';
import IntercomInput from 'components/Form/IntercomInput';
import EntityCard from 'components/EntityCard';
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
      render={({ values, errors, touched, setFieldValue }) => (
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
                      horizontal
                      width={300}
                      hasHoverStyle
                      onChange={setFieldValue}
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
                      horizontal
                      width={300}
                      hasHoverStyle
                      onChange={setFieldValue}
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
                      horizontal
                      width={300}
                      hasHoverStyle
                      onChange={setFieldValue}
                    />
                  )}
                />
                <CurrencyInput
                  title={<FormattedMessage {...messages.currency} />}
                  value={values.currency}
                  onChange={v => setFieldValue('currency', v)}
                  horizontal
                  width={300}
                  required
                  hasHoverStyle
                />
                <IntercomInput
                  title={<FormattedMessage {...messages.incoterms} />}
                  value={values.incoterms}
                  onChange={v => setFieldValue('incoterms', v)}
                  horizontal
                  width={300}
                  required
                  hasHoverStyle
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
                      horizontal
                      hasHoverStyle
                      width={300}
                      onChange={setFieldValue}
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
                      <EntityCard icon="PARTNER" color="BLACK">
                        <div className={ExporterCardStyle}>
                          <img src={FALLBACK_IMAGE} alt="exporter_image" />
                          <div>ExporterA</div>
                        </div>
                      </EntityCard>
                    </div>
                    <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '60vw' }}>
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
              <TextInput
                id="PO"
                label="PO NO"
                title={<FormattedMessage {...messages.totalOrderedQuantity} />}
                horizontal
                width={300}
                readOnly
              />
              <TextInput
                id="PI"
                label="PI NO"
                title={<FormattedMessage {...messages.batchedQuantity} />}
                horizontal
                width={300}
                readOnly
              />
              <TextInput
                id="poDate"
                label="PO ISSUANCE DATE"
                title={<FormattedMessage {...messages.shippedQuantity} />}
                horizontal
                width={300}
                readOnly
              />
            </InputGroup>
            <InputGroup fieldGap={16}>
              <TextInput
                id="PO"
                label="PO NO"
                title={<FormattedMessage {...messages.totalOrderPrice} />}
                horizontal
                width={300}
                readOnly
              />
              <TextInput
                id="PI"
                label="PI NO"
                title={<FormattedMessage {...messages.totalOrderedQuantity} />}
                horizontal
                width={300}
                readOnly
              />
              <TextInput
                id="poDate"
                label="PO ISSUANCE DATE"
                title={<FormattedMessage {...messages.totalBatchedQuantity} />}
                horizontal
                width={300}
                readOnly
              />
            </InputGroup>
          </div>
        </div>
      )}
    />
  </div>
);

export default OrderSection;
