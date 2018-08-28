// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FormattedMessage } from 'react-intl';
import Display from 'components/Display';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import yupToFormErrors from 'utils/yupToFormErrors';
import {
  FieldItem,
  StyledTextInput,
  StyledDateInput,
  DashedPlusButton,
  Form,
  FormObserver,
  Field,
  TagsInput,
  InputGroup,
} from 'components/Form';
import CurrencyInput from 'components/Form/CurrencyInput';
import IncotermInput from 'components/Form/IncotermInput';
import Divider from 'components/Divider';
import EntityCard from 'components/EntityCard';
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
  onChange: Function,
  initialValues: {
    piNo?: string,
    poNo?: string,
    currency?: string,
    incoterm?: string,
    deliveryPlace?: string,
    issuedAt?: Date,
  },
};

const OrderSchema = Yup.object().shape({
  poNo: Yup.string().required(),
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
                  name="poNo"
                  render={({ input, meta }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.PO} />}
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
                      labelOptions={{
                        required: true,
                      }}
                      tooltipOptions={{
                        isNew,
                        tooltipBubbleOptions: {
                          errorMessage: touched.poNo && errors.poNo,
                          changedValues: {
                            oldValue: initialValues.poNo,
                            newValue: input.value,
                          },
                        },
                      }}
                    />
                  )}
                />
                <Field
                  name="piNo"
                  render={({ input, meta }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.PI} />}
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
                            oldValue: initialValues.piNo,
                            newValue: input.value,
                          },
                        },
                      }}
                    />
                  )}
                />
                <Field
                  name="issuedAt"
                  render={({ input, meta }) => (
                    <FieldItem
                      label={<FormattedMessage {...messages.date} />}
                      input={hasError => (
                        <StyledDateInput
                          isFocused={meta.isActive}
                          forceHoverStyle={isNew}
                          hasError={hasError}
                          width="200px"
                          pureInputOptions={{
                            ...input,
                          }}
                        />
                      )}
                      labelOptions={{
                        required: true,
                      }}
                      tooltipOptions={{
                        isNew,
                        tooltipBubbleOptions: {
                          changedValues: {
                            oldValue: <FormattedDate value={initialValues.issuedAt} />,
                            newValue: <FormattedDate value={input.value} />,
                          },
                        },
                      }}
                    />
                  )}
                />
                {/* FIXME: enum input is wrong when send the selected value */}
                <CurrencyInput
                  name="currency"
                  title={<FormattedMessage {...messages.currency} />}
                  value={values.currency}
                  onChange={value => setFieldValue('currency', value)}
                  width="200px"
                  required
                />
                <IncotermInput
                  name="incoterm"
                  title={<FormattedMessage {...messages.incoterms} />}
                  value={values.incoterm}
                  onChange={value => setFieldValue('incoterm', value)}
                  width="200px"
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
                          <EntityCard icon="PARTNER" color="PARTNER">
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
                        )}

                        <SlideView
                          isOpen={opened}
                          onRequestClose={toggle}
                          options={{ width: '1030px' }}
                        >
                          <SelectExporters
                            selected={values.exporter}
                            onSelect={({ group, name }) =>
                              setFieldValue('exporter', { id: group.id, name: name || group.name })
                            }
                          />
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
