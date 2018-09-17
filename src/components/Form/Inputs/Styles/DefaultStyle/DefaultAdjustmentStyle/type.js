// @flow

type OptionalProps = {
  isNew: boolean,
};

export type DefaultAdjustmentStyleProps = OptionalProps & {
  adjustment: Object,
  index: number,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
  formHelper: any,
  values: any,
  validationRules: any,
  activeField: any,
};

export const defaultProps = {
  isNew: false,
};

export default defaultProps;
