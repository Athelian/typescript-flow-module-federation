// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { FormContainer } from 'modules/form';
import GridColumn from 'components/GridColumn';
import Adjustment from './components/Adjustment';
import { QuantityAdjustmentsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const QuantityAdjustmentsSection = ({ isNew }: Props) => (
  <div className={QuantityAdjustmentsSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, validationRules }) => {
        const values = { ...originalValues, ...state };

        return (
          <Subscribe to={[FormContainer]}>
            {({ state: { activeField }, ...formHelper }) => (
              <GridColumn>
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
              </GridColumn>
            )}
          </Subscribe>
        );
      }}
    </Subscribe>
  </div>
);

export default QuantityAdjustmentsSection;
