// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  priceInputFactory,
  dateInputFactory,
  // selectEnumInputFactory,
  // selectSearchEnumInputFactory,
} from 'modules/form/helpers';
import { getByPath } from 'utils/fp';
import { WrapperStyle, ItemStyle } from './style';

type Props = {
  cell: string,
  fields: Array<{
    name: string,
    type: string,
  }>,
  values: Object,
  validator: Object,
};

const renderInputByType = (type: string): Function => {
  switch (type) {
    case 'number':
      return numberInputFactory;
    case 'price':
      return priceInputFactory;
    case 'date':
      return dateInputFactory;
    // case 'enum':
    //   return selectEnumInputFactory;
    // case 'search':
    //   return selectSearchEnumInputFactory;

    default:
      return textInputFactory;
  }
};

export default function TableItem({ cell, fields, values, validator }: Props) {
  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type }) => (
        <div className={ItemStyle} key={name}>
          <FormField
            name={`${cell}.${name}`}
            initValue={getByPath(name, values)}
            validator={validator}
            values={values}
          >
            {({ name: fieldName, ...inputHandlers }) =>
              renderInputByType(type)({
                width: '80px',
                height: '20px',
                inputHandlers,
                name: fieldName,
                hasTooltip: false,
                isNew: false,
                originalValue: getByPath(name, values),
                align: 'left',
              })
            }
          </FormField>
        </div>
      ))}
    </div>
  );
}
