// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BATCH_UPDATE, BATCH_SET_QUANTITY } from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import { FormField, FormContainer } from 'modules/form';
import { SectionHeader, SectionWrapper, NumberInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import validator from 'modules/batch/form/validator';
import CurrentQuantity from './CurrentQuantity';
import { QuantitySectionWrapperStyle } from './style';

const QuantitySection = () => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <SectionWrapper id="batch_quantitySection">
      <SectionHeader
        icon="QUANTITY_ADJUSTMENTS"
        title={<FormattedMessage id="modules.Batches.quantity" defaultMessage="QUANTITY" />}
      />
      <div className={QuantitySectionWrapperStyle}>
        <Subscribe to={[FormContainer]}>
          {({ setFieldTouched }) => (
            <Subscribe to={[BatchInfoContainer]}>
              {({ originalValues, state, setFieldArrayValue, calculatePackageQuantity }) => {
                const values = { ...originalValues, ...state };

                const { quantity } = values;

                return (
                  <GridColumn gap="10px">
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          required
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.initialQuantity"
                              defaultMessage="INITIAL QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                          InputWrapperComponent={CurrentQuantity}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.producedQuantity"
                              defaultMessage="PRODUCED QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.preShippedQuantity"
                              defaultMessage="PRE-SHIPPED QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.shippedQuantity"
                              defaultMessage="SHIPPED QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.postShippedQuantity"
                              defaultMessage="POST SHIPPED QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', evt.target.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.deliveredQuantity"
                              defaultMessage="DELIVERED QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>
                  </GridColumn>
                );
              }}
            </Subscribe>
          )}
        </Subscribe>
      </div>
    </SectionWrapper>
  );
};

export default QuantitySection;
