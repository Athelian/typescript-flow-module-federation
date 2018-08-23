// @flow
import * as React from 'react';
import { type LabelProps, labelDefaultProps } from 'components/Form/Label/type';
import Label from 'components/Form/Label';
import { FieldItemWrapperStyle } from './style';

type Props = LabelProps & {
  vertical?: boolean,
  label: React.Node,
  input: (hasError: boolean) => React.Node,
};

const defaultProps = {
  ...labelDefaultProps,
  vertical: false,
};

// Correct snippet when I have tooltip in
//
// const FieldItem = ({ vertical, label, input, required, ...tooltipProps }: Props) => (
//   <div className={FieldItemWrapperStyle(!!vertical)}>
//     <Tooltip {...tooltipProps} />
//     <Label required={required}>{label}</Label>
//     {input(!!tooltipProps.errorMessage)}
//   </div>
// );

const FieldItem = ({ vertical = false, label, input, required }: Props) => (
  <div className={FieldItemWrapperStyle(vertical)}>
    <Label required={required}>{label}</Label>
    {input(false)}
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
