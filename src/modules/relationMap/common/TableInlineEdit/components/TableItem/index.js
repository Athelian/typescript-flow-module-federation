// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { HotKeys } from 'react-hotkeys';
import { FormField, FormContainer } from 'modules/form';
import { getByPath } from 'utils/fp';
import { TableDisableCell } from '..';
import { WrapperStyle, ItemStyle } from './style';
import {
  InlineTextInput,
  InlineNumberInput,
  InlineNumberAdjustmentInput,
  InlineDateInput,
  InlineSearchEnumInput,
  InlineInChargeInput,
  InlineTagInput,
  InlineProductProvider,
  InlineMetricInput,
  InlineForwarderInput,
  InlineTimeLineInput,
} from './components';

type Props = {
  cell: string,
  rowNo: number,
  fields: Array<{
    name: string,
    type: string,
    meta?: Object,
  }>,
  values: ?Object,
  validator: Object,
};

const handler = (activeField, setActiveField) => ({
  firstRight: () => {
    console.log('active', activeField, setActiveField);
    setActiveField('orders.589.piNo');
  },
});
function renderItem({
  id,
  type,
  value,
  name,
  meta,
  values,
  isFocused,
  onFocus,
  onBlur,
}: {
  id: string,
  value: any,
  type: string,
  name: string,
  values: Object,
  meta?: Object,
  isFocused: boolean,
  onFocus: boolean,
  onBlur: boolean,
}) {
  switch (type) {
    case 'number':
      return <InlineNumberInput name={name} value={value} {...meta} id={id} />;

    case 'numberAdjustment': {
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
          id={id}
        />
      );
    }

    case 'date':
      return <InlineDateInput name={name} value={value} {...meta} id={id} />;

    case 'timeline': {
      if (!value) return <TableDisableCell />;
      return <InlineTimeLineInput name={name} value={value} {...meta} id={id} />;
    }

    case 'metric':
      return <InlineMetricInput name={name} value={value} values={values} {...meta} id={id} />;

    case 'enum':
      return <InlineSearchEnumInput name={name} value={value} {...meta} id={id} />;

    case 'inCharges':
      return <InlineInChargeInput name={name} values={value} {...meta} id={id} />;

    case 'forwarders':
      return <InlineForwarderInput name={name} values={value} {...meta} id={id} />;

    case 'tags':
      return <InlineTagInput name={name} values={value} {...meta} id={id} />;

    case 'productProvider':
      return (
        <InlineProductProvider
          name={name}
          value={value}
          exporter={value.exporter.id}
          {...meta}
          id={id}
        />
      );

    default:
      return (
        <InlineTextInput
          id={id}
          name={name}
          value={value}
          {...meta}
          isFocused={isFocused}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
  }
}

export default function TableItem({ cell, fields, values, validator, rowNo }: Props) {
  if (!values) return null;

  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, meta }, fieldCounter) => (
        <div className={ItemStyle} key={name}>
          <Subscribe to={[FormContainer]}>
            {({ state, setActiveField }) => (
              <HotKeys handlers={handler(state, setActiveField)}>
                <FormField
                  name={`${cell}.${name}`}
                  initValue={getByPath(name, values)}
                  validator={validator}
                  values={values}
                >
                  {({ name: fieldName, isFocused, onFocus, onBlur }) =>
                    renderItem({
                      id: `${rowNo}-${fieldCounter + 1}`,
                      name: fieldName,
                      type,
                      meta,
                      value: getByPath(name, values),
                      values,
                      isFocused,
                      onFocus,
                      onBlur,
                    })
                  }
                </FormField>
              </HotKeys>
            )}
          </Subscribe>
        </div>
      ))}
    </div>
  );
}
