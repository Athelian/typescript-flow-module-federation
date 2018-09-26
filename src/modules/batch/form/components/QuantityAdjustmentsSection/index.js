// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { numberInputFactory } from 'modules/form/helpers';
import BatchFormContainer from 'modules/batch/form/container';
import FormattedNumber from 'components/FormattedNumber';
import { NewButton } from 'components/Buttons';
import { injectUid } from 'utils/id';
import Divider from 'components/Divider';
import { FormField } from 'modules/form';
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

const QuantityAdjustmentsSection = ({ isNew }: Props) => (
  <div className={QuantityAdjustmentsSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldArrayValue, removeArrayItem }) => {
        const values = { ...originalValues, ...state };

        const currentQuantity = values.batchAdjustments.reduce(
          (total, adjustment) => adjustment.quantity + total,
          values.quantity
        );

        return (
          <GridColumn gap="10px">
            <FieldItem
              label={<Label>INITIAL QUANTITY</Label>}
              input={
                <div className={InitialQuantityStyle}>
                  <FormattedNumber value={values.quantity || 0} />
                </div>
              }
            />
            {values.batchAdjustments &&
              values.batchAdjustments.map(
                (adjustment, index) =>
                  adjustment && (
                    <DefaultAdjustmentStyle
                      isNew={isNew}
                      index={index}
                      adjustment={adjustment}
                      key={adjustment.id}
                      setFieldArrayValue={setFieldArrayValue}
                      removeArrayItem={removeArrayItem}
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
                          {({ name, ...inputHandlers }) =>
                            numberInputFactory({
                              inputHandlers,
                              name,
                              isNew,
                              initValue: adjustment.quantity,
                            })
                          }
                        </FormField>
                      }
                    />
                  )
              )}
            <div className={AddAdjustmentButtonWrapperStyle}>
              <NewButton
                label="NEW ADJUSTMENT"
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
            <Divider />
            <FieldItem
              label={<Label>CURRENT QUANTITY</Label>}
              input={
                <div className={CurrentQuantityStyle}>
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

export default QuantityAdjustmentsSection;
