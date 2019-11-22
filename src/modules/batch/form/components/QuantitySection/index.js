// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BATCH_UPDATE, BATCH_SET_QUANTITY } from 'modules/permission/constants/batch';
import { findActiveQuantityField } from 'utils/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import { FormField, FormContainer } from 'modules/form';
import { SectionHeader, SectionWrapper, NumberInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import validator from 'modules/batch/form/validator';
import {
  INITIAL_QUANTITY,
  PRODUCED_QUANTITY,
  PRE_SHIPPED_QUANTITY,
  SHIPPED_QUANTITY,
  POST_SHIPPED_QUANTITY,
  DELIVERED_QUANTITY,
} from 'modules/batch/constants';
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

                const {
                  quantity,
                  producedQuantity,
                  preShippedQuantity,
                  shippedQuantity,
                  postShippedQuantity,
                  deliveredQuantity,
                } = values;

                const latestQuantityField = findActiveQuantityField({
                  producedQuantity,
                  preShippedQuantity,
                  shippedQuantity,
                  postShippedQuantity,
                  deliveredQuantity,
                });
                return (
                  <GridColumn gap="10px">
                    <FormField
                      name={INITIAL_QUANTITY}
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
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === INITIAL_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name={PRODUCED_QUANTITY}
                      initValue={producedQuantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          nullable
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === PRODUCED_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name={PRE_SHIPPED_QUANTITY}
                      initValue={preShippedQuantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          nullable
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === PRE_SHIPPED_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name={SHIPPED_QUANTITY}
                      initValue={shippedQuantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          nullable
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === SHIPPED_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name={POST_SHIPPED_QUANTITY}
                      initValue={postShippedQuantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          nullable
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === POST_SHIPPED_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name={DELIVERED_QUANTITY}
                      initValue={deliveredQuantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          nullable
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue(name, evt.target.value);
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
                          InputWrapperComponent={
                            latestQuantityField === DELIVERED_QUANTITY
                              ? CurrentQuantity
                              : React.Fragment
                          }
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
