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

const findActiveQuantityField = ({
  producedQuantity,
  preShippedQuantity,
  shippedQuantity,
  postShippedQuantity,
  deliveredQuantity,
}: {
  producedQuantity: ?number,
  preShippedQuantity: ?number,
  shippedQuantity: ?number,
  postShippedQuantity: ?number,
  deliveredQuantity: ?number,
}) => {
  if (deliveredQuantity) return 'deliveredQuantity';

  if (postShippedQuantity) return 'postShippedQuantity';

  if (shippedQuantity) return 'shippedQuantity';

  if (preShippedQuantity) return 'preShippedQuantity';

  if (producedQuantity) return 'producedQuantity';

  return 'quantity';
};

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

                const activeQuantity = findActiveQuantityField({
                  producedQuantity,
                  preShippedQuantity,
                  shippedQuantity,
                  postShippedQuantity,
                  deliveredQuantity,
                });
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
                          InputWrapperComponent={
                            activeQuantity === 'quantity' ? CurrentQuantity : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="producedQuantity"
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
                            setFieldArrayValue('producedQuantity', evt.target.value);
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
                            activeQuantity === 'producedQuantity' ? CurrentQuantity : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="preShippedQuantity"
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
                            setFieldArrayValue('preShippedQuantity', evt.target.value);
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
                            activeQuantity === 'preShippedQuantity'
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="shippedQuantity"
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
                            setFieldArrayValue('shippedQuantity', evt.target.value);
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
                            activeQuantity === 'shippedQuantity' ? CurrentQuantity : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="postShippedQuantity"
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
                            setFieldArrayValue('postShippedQuantity', evt.target.value);
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
                            activeQuantity === 'postShippedQuantity'
                              ? CurrentQuantity
                              : React.Fragment
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="deliveredQuantity"
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
                            setFieldArrayValue('deliveredQuantity', evt.target.value);
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
                            activeQuantity === 'deliveredQuantity'
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
