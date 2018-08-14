// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import EnumProvider from 'providers/enum';
import SlideView from 'components/SlideView';
import UserAvatar from 'components/UserAvatar';
import { FormattedMessage } from 'react-intl';
import yupToFormErrors from 'utils/yupToFormErrors';
import { getByPathWithDefault } from 'utils/fp';
import { Form, Field, TextInput, DropDown, TagsInput } from 'components/Form';
import SelectExporters from '../SelectExporters';
import { WrapperStyle, HeaderSectionStyle, InputsWrapperStyle } from './style';
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
    <div className={HeaderSectionStyle}>
      <h3>Orders</h3>

      <div>
        {!isNew && (
          <React.Fragment>
            <p>Last Modified: {initialValues.updatedAt}</p>
            <UserAvatar profileUrl="" />
          </React.Fragment>
        )}
        <p>Status: {initialValues.status} </p>
      </div>
    </div>
    <Form
      initialValues={initialValues}
      validateOnChange
      validateOnBlur
      validations={onValidate}
      onSubmit={onSubmit}
      render={({ errors, touched }) => (
        <div className={InputsWrapperStyle}>
          <div>
            <Field
              name="PO"
              render={({ input }) => (
                <TextInput
                  {...input}
                  id="PO"
                  label="PO NO"
                  title={<FormattedMessage {...messages.required} />}
                  errorMessage={touched.NO && errors.NO}
                  required
                  editable={isNew}
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
                  title={<FormattedMessage {...messages.required} />}
                  errorMessage={touched.PI && errors.PI}
                  editable={isNew}
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
                  title={<FormattedMessage {...messages.required} />}
                  errorMessage={touched.date && errors.date}
                  editable={isNew}
                />
              )}
            />
            <Field
              name="currency"
              render={({ input }) => (
                <EnumProvider enumType="CurrencyEnum">
                  {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;

                    return (
                      <DropDown
                        {...input}
                        id="currency"
                        required
                        label="CURRENCY"
                        title={<FormattedMessage {...messages.required} />}
                        errorMessage={touched.currency && errors.currency}
                        editable={isNew}
                        options={getByPathWithDefault([], '__type.enumValues', data).map(item => ({
                          label: item.name,
                          value: item.name,
                        }))}
                      />
                    );
                  }}
                </EnumProvider>
              )}
            />
            <Field
              name="incoterms"
              render={({ input }) => (
                <EnumProvider enumType="IncotermEnum">
                  {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;

                    return (
                      <DropDown
                        {...input}
                        id="incoterms"
                        label="INCOTERMS"
                        title={<FormattedMessage {...messages.required} />}
                        errorMessage={touched.incoterms && errors.incoterms}
                        editable={isNew}
                        options={getByPathWithDefault([], '__type.enumValues', data).map(item => ({
                          label: item.name,
                          value: item.name,
                        }))}
                      />
                    );
                  }}
                </EnumProvider>
              )}
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
                />
              )}
            />
            <TagsInput editable={isNew} label="TAGS" id="tags" name="tags" tags={[]} />
          </div>
          <BooleanValue>
            {({ value: opened, toggle }) => (
              <React.Fragment>
                <button type="button" onClick={toggle}>
                  Exporter
                </button>
                <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '60vw' }}>
                  <SelectExporters />
                </SlideView>
              </React.Fragment>
            )}
          </BooleanValue>
        </div>
      )}
    />
  </div>
);

export default OrderSection;
