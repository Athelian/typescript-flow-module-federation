// @flow
import * as React from 'react';
import { DefaultAdjustmentStyle } from 'components/Form';
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
  />
);

DefaultQuantityAdjustmentStyle.defaultProps = defaultProps;

export default DefaultQuantityAdjustmentStyle;
