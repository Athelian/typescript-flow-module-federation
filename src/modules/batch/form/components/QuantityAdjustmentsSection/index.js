// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BATCH_CREATE, BATCH_UPDATE } from 'modules/permission/constants/batch';
import usePermission from 'hooks/usePermission';
import { NumberInputFactory } from 'modules/form/factories';
import BatchFormContainer from 'modules/batch/form/container';
import FormattedNumber from 'components/FormattedNumber';
import { NewButton } from 'components/Buttons';
import { injectUid } from 'utils/id';
import Divider from 'components/Divider';
import { FormField, FormContainer } from 'modules/form';
import { FieldItem, Label, DefaultAdjustmentStyle } from 'components/Form';
import GridColumn from 'components/GridColumn';
import {
  QuantityAdjustmentsSectionWrapperStyle,
  InitialQuantityStyle,
  AddAdjustmentButtonWrapperStyle,
  CurrentQuantityStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const QuantityAdjustmentsSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowCreateOrUpdate = hasPermission(BATCH_CREATE) || hasPermission(BATCH_UPDATE);

  return (
    <div className={QuantityAdjustmentsSectionWrapperStyle}>
      <Subscribe to={[BatchFormContainer]}>
        {({
          originalValues,
          state,
          setFieldArrayValue,
          removeArrayItem,
          calculatePackageQuantity,
        }) => {
          const values = { ...originalValues, ...state };

          const currentQuantity = values.batchAdjustments.reduce(
            (total, adjustment) => adjustment.quantity + total,
            values.quantity
          );

          return (
            <GridColumn gap="10px">
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.Batches.initialQuantity"
                      defaultMessage="INITIAL QUANTITY"
                    />
                  </Label>
                }
                input={
                  <div data-testid="initialQuantityDiv" className={InitialQuantityStyle}>
                    <FormattedNumber value={values.quantity || 0} />
                  </div>
                }
              />
              {values.batchAdjustments &&
                values.batchAdjustments.map(
                  (adjustment, index) =>
                    adjustment && (
                      <Subscribe key={adjustment.id} to={[FormContainer]}>
                        {({ setFieldTouched }) => (
                          <DefaultAdjustmentStyle
                            editable={allowCreateOrUpdate}
                            isNew={isNew}
                            index={index}
                            adjustment={adjustment}
                            setFieldArrayValue={setFieldArrayValue}
                            removeArrayItem={targetName => {
                              removeArrayItem(targetName);
                              calculatePackageQuantity(setFieldTouched);
                            }}
                            enumType="BatchAdjustmentReason"
                            targetName="batchAdjustments"
                            typeName="reason"
                            memoName="memo"
                            valueInput={
                              <FormField
                                name={`batchAdjustments.${index}.quantity`}
                                initValue={adjustment.quantity}
                                setFieldValue={setFieldArrayValue}
                              >
                                {({ name, ...inputHandlers }) => (
                                  <NumberInputFactory
                                    name={name}
                                    {...inputHandlers}
                                    onBlur={evt => {
                                      inputHandlers.onBlur(evt);
                                      setFieldArrayValue(name, inputHandlers.value);
                                      calculatePackageQuantity(setFieldTouched);
                                    }}
                                    isNew={isNew}
                                    originalValue={adjustment.quantity}
                                    editable={allowCreateOrUpdate}
                                  />
                                )}
                              </FormField>
                            }
                          />
                        )}
                      </Subscribe>
                    )
                )}
              {allowCreateOrUpdate && (
                <div className={AddAdjustmentButtonWrapperStyle}>
                  <NewButton
                    data-testid="addAdjustmentButton"
                    label={
                      <FormattedMessage
                        id="modules.Batches.newAdjustment"
                        defaultMessage="NEW ADJUSTMENT"
                      />
                    }
                    onClick={() => {
                      setFieldArrayValue(
                        `batchAdjustments[${values.batchAdjustments.length}]`,
                        injectUid({
                          isNew: true,
                          reason: 'Other',
                          quantity: 0,
                          memo: '',
                          updatedAt: new Date(),
                        })
                      );
                    }}
                  />
                </div>
              )}
              <Divider />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.Batches.currentQuantity"
                      defaultMessage="CURRENT QUANTITY"
                    />
                  </Label>
                }
                input={
                  <div data-testid="currentQuantityDiv" className={CurrentQuantityStyle}>
                    <FormattedNumber value={currentQuantity || 0} />
                  </div>
                }
              />
            </GridColumn>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default QuantityAdjustmentsSection;
