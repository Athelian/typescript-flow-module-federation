// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
import { getByPath } from 'utils/fp';
import { WrapperStyle, ItemStyle } from './style';
import InlineTextInput from './components/InlineTextInput';
import InlineNumberInput from './components/InlineNumberInput';
import InlineDateInput from './components/InlineDateInput';
import InlineSearchEnumInput from './components/InlineSearchEnumInput';

type Props = {
  cell: string,
  fields: Array<{
    name: string,
    type: string,
    meta?: Object,
  }>,
  values: Object,
  validator: Object,
};

function renderItem({
  type,
  value,
  name,
  meta,
}: {
  value: any,
  type: string,
  name: string,
  meta?: Object,
}) {
  if (type === 'number') return <InlineNumberInput name={name} value={value} {...meta} />;
  if (type === 'date') return <InlineDateInput name={name} value={value} {...meta} />;
  if (type === 'enum') return <InlineSearchEnumInput name={name} value={value} {...meta} />;

  return <InlineTextInput name={name} value={value} {...meta} />;
}

export default function TableItem({ cell, fields, values, validator }: Props) {
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
              renderItem({ name: fieldName, type, meta, value: getByPath(name, values) })
            }
          </FormField>
        </div>
      ))}
    </div>
  );
}
