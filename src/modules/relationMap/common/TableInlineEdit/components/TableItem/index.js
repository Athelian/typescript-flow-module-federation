// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
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

type OptionalProps = {
  columnNo: number,
};
type Props = OptionalProps & {
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

const defaultProps = {
  columnNo: 0,
};

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

function TableItem({ cell, fields, values, validator, rowNo, columnNo }: Props) {
  if (!values) return null;

  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, meta }, fieldCounter) => (
        <div className={ItemStyle} key={name}>
          <FormField
            name={`${cell}.${name}`}
            initValue={getByPath(name, values)}
            validator={validator}
            values={values}
          >
            {({ name: fieldName, isFocused, onFocus, onBlur }) =>
              renderItem({
                id: `${rowNo}-${fieldCounter + columnNo + 1}`,
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
        </div>
      ))}
    </div>
  );
}

TableItem.defaultProps = defaultProps;

export default TableItem;
