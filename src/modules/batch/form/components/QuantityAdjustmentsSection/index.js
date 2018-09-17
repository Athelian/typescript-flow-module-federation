// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import FormattedNumber from 'components/FormattedNumber';
import NewButton from 'components/NavButtons/NewButton';
import { injectUid } from 'utils/id';
import Divider from 'components/Divider';
import { FormContainer } from 'modules/form';
import { FieldItem, Label, DefaultQuantityAdjustmentStyle } from 'components/Form';
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
      {({ originalValues, state, setFieldArrayValue, removeArrayItem, validationRules }) => {
        const values = { ...originalValues, ...state };

        const currentQuantity = values.batchAdjustments.reduce(
          (total, adjustment) => adjustment.quantity + total,
          values.quantity
        );

        return (
          <Subscribe to={[FormContainer]}>
            {({ state: { activeField }, ...formHelper }) => (
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
                        <DefaultQuantityAdjustmentStyle
                          isNew={isNew}
                          index={index}
                          adjustment={adjustment}
                          key={adjustment.id}
                          setFieldArrayValue={setFieldArrayValue}
                          removeArrayItem={removeArrayItem}
                          formHelper={formHelper}
                          values={values}
                          validationRules={validationRules}
                          activeField={activeField}
                        />
                      )
                  )}
                <div className={AddAdjustmentButtonWrapperStyle}>
                  <NewButton
                    title="NEW ADJUSTMENT"
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
                      formHelper.setFieldTouched(
                        `batchAdjustments[${values.batchAdjustments.length}]`
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
            )}
          </Subscribe>
        );
      }}
    </Subscribe>
  </div>
);

export default QuantityAdjustmentsSection;
