// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
import { getByPath } from 'utils/fp';
import { WrapperStyle, ItemStyle } from './style';
import InlineTextInput from './components/InlineTextInput';
import InlineNumberInput from './components/InlineNumberInput';
import InlineNumberAdjustmentInput from './components/InlineNumberAdjustmentInput';
import InlineDateInput from './components/InlineDateInput';
import InlineSearchEnumInput from './components/InlineSearchEnumInput';
import InlineInChargeInput from './components/InlineInChargeInput';
import InlineTagInput from './components/InlineTagInput';
import InlineProductProvider from './components/InlineProductProvider';
import InlineMetricInput from './components/InlineMetricInput';

type Props = {
  cell: string,
  fields: Array<{
    name: string,
    type: string,
    meta?: Object,
  }>,
  values: ?Object,
  validator: Object,
};

function renderItem({
  type,
  value,
  name,
  meta,
  values,
}: {
  value: any,
  type: string,
  name: string,
  values: Object,
  meta?: Object,
}) {
  if (type === 'number') return <InlineNumberInput name={name} value={value} {...meta} />;
  if (type === 'numberAdjustment') {
    const adjustments = getByPath('batchAdjustments', values) || [];
    const totalAdjustment = adjustments
      ? adjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
      : 0;
    return (
      <InlineNumberAdjustmentInput
        name={name}
        value={value}
        {...meta}
        adjustment={totalAdjustment}
      />
    );
  }
  if (type === 'date') return <InlineDateInput name={name} value={value} {...meta} />;
  if (type === 'metric') return <InlineMetricInput name={name} value={value} {...meta} />;
  if (type === 'enum') return <InlineSearchEnumInput name={name} value={value} {...meta} />;
  if (type === 'inCharges') return <InlineInChargeInput name={name} values={value} {...meta} />;
  if (type === 'tags') return <InlineTagInput name={name} values={value} {...meta} />;
  if (type === 'productProvider')
    return (
      <InlineProductProvider name={name} value={value} exporter={value.exporter.id} {...meta} />
    );

  return <InlineTextInput name={name} value={value} {...meta} />;
}

export default function TableItem({ cell, fields, values, validator }: Props) {
  if (!values) return null;
  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, meta }) => (
        <div className={ItemStyle} key={name}>
          <FormField
            name={`${cell}.${name}`}
            initValue={getByPath(name, values)}
            validator={validator}
            values={values}
          >
            {({ name: fieldName }) =>
              renderItem({ name: fieldName, type, meta, value: getByPath(name, values), values })
            }
          </FormField>
        </div>
      ))}
    </div>
  );
}
