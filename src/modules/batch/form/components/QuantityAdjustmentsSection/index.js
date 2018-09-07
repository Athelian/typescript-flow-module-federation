// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import FormattedNumber from 'components/FormattedNumber';
import NewButton from 'components/NavButtons/NewButton';
import Divider from 'components/Divider';
import { FormContainer } from 'modules/form';
import { FieldItem, Label } from 'components/Form';
import GridColumn from 'components/GridColumn';
import Adjustment from './components/Adjustment';
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
      {({ originalValues, state, setFieldValue, validationRules }) => {
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
                      <FormattedNumber value={values.quantity} />
                    </div>
                  }
                />
                {values.batchAdjustments.map((adjustment, index) => (
                  <Adjustment
                    isNew={isNew}
                    index={index}
                    adjustment={adjustment}
                    key={adjustment.id}
                    setFieldValue={setFieldValue}
                    formHelper={formHelper}
                    values={values}
                    validationRules={validationRules}
                    activeField={activeField}
                  />
                ))}
                <div className={AddAdjustmentButtonWrapperStyle}>
                  <NewButton title="NEW ADJUSTMENT" />
                </div>
                <Divider />
                <FieldItem
                  label={<Label>CURRENT QUANTITY</Label>}
                  input={
                    <div className={CurrentQuantityStyle}>
                      <FormattedNumber value={currentQuantity} />
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
