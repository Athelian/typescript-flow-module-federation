// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
import { DefaultAdjustmentStyle, DefaultStyle, NumberInput } from 'components/Form';
import {
  type DefaultAdjustmentStyleProps as Props,
  defaultProps,
} from 'components/Form/Inputs/Styles/DefaultStyle/DefaultAdjustmentStyle/type';

const DefaultQuantityAdjustmentStyle = ({
  adjustment,
  index,
  isNew,
  setFieldArrayValue,
  removeArrayItem,
  formHelper,
  values,
  validationRules,
  activeField,
}: Props) => (
  <DefaultAdjustmentStyle
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
    enumType="BatchAdjustmentReason"
    targetName="batchAdjustments"
    typeName="reason"
    memoName="memo"
    valueInput={
      <FormField
        name={`batchAdjustments.${index}.quantity`}
        initValue={adjustment.quantity}
        validationOnChange
        onValidate={newValue =>
          formHelper.onValidation({ ...values, ...newValue }, validationRules())
        }
        setFieldValue={setFieldArrayValue}
        {...formHelper}
      >
        {({ name, ...inputHandlers }) => (
          <DefaultStyle
            type="number"
            isFocused={activeField === name}
            forceHoverStyle={isNew}
            width="200px"
          >
            <NumberInput name={name} {...inputHandlers} />
          </DefaultStyle>
        )}
      </FormField>
    }
  />
);

DefaultQuantityAdjustmentStyle.defaultProps = defaultProps;

export default DefaultQuantityAdjustmentStyle;
