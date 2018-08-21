// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import yupToFormErrors from 'utils/yupToFormErrors';
import { Form, Field, TextInput, TagsInput, InputGroup } from 'components/Form';
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
  ValueStyle,
} from './style';

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
  <div className={OrderSectionWrapperStyle}>
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
          <React.Fragment>
            <div className={MainFieldsWrapperStyle}>
              <InputGroup fieldGap={20}>
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
              <div className={ExporterSectionStyle}>
                <Label title={<FormattedMessage {...messages.exporter} />} required>
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
                            <div className={ExporterNameStyle}>Exporter A</div>
                          </div>
                        </EntityCard>
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
                </Label>
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
              <InputGroup fieldGap={20}>
                <Label title="ORDERED QTY" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={totalOrderedQuantity} />
                  </div>
                </Label>
                <Label title="BATCHED QTY" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={values.batchedQuantity} />
                  </div>
                </Label>
                <Label title="SHIPPED QTY" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={values.shippedQuantity} />
                  </div>
                </Label>
              </InputGroup>

              <InputGroup fieldGap={20}>
                <Label title="TOTAL PRICE" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={values.totalPrice} />
                  </div>
                </Label>
                <Label title="TOTAL ITEMS" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={values.items ? values.items.length : 0} />
                  </div>
                </Label>
                <Label title="TOTAL BATCHES" horizontal>
                  <div className={ValueStyle}>
                    <FormattedNumber value={totalBatches} />
                  </div>
                </Label>
              </InputGroup>
            </div>
          </React.Fragment>
        );
      }}
    />
  </div>
);

export default OrderSection;
