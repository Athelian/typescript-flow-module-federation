// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { list2Map } from 'modules/form/helpers/customFieldsInput';
import TableDisableCell from 'modules/relationMap/common/TableInlineEdit/components/TableDisableCell';
import { WrapperStyle, ItemStyle } from './style';
import InlineTextInput from './components/InlineTextInput';

type Props = {
  cell: string,
  fields: Array<{
    id: string,
    name: string,
    entityType: string,
    sort: Object,
  }>,
  values: ?Object,
  validator: Object,
};

function renderItem({ name, value }: { name: string, value: any }) {
  return value ? <InlineTextInput name={name} value={value.value.string} /> : <TableDisableCell />;
}

export default function TableItemForCustomFields({ cell, fields, values, validator }: Props) {
  if (!values) return null;

  const customFields = getByPathWithDefault(
    {
      mask: null,
      fieldDefinitions: [],
      fieldValues: [],
    },
    'customFields',
    values
  );
  const { fieldValues } = customFields;
  const fieldValueMap = list2Map(fieldValues);
  return (
    <div className={WrapperStyle}>
      {fields.map(({ id, name }) => (
        <div className={ItemStyle} key={name}>
          <FormField
            name={`${cell}.${name}`}
            initValue={fieldValueMap.get(id)}
            validator={validator}
            values={values}
          >
            {({ name: fieldName }) =>
              renderItem({
                name: fieldName,
                value: fieldValueMap.get(id),
                values,
              })
            }
          </FormField>
        </div>
      ))}
    </div>
  );
}
