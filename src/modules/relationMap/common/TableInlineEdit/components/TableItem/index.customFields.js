// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { list2Map } from 'utils/customFields';
import { FormField } from 'modules/form';
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
      {fields.map(({ id, name }) => {
        const fieldValue = fieldValueMap.get(id);

        return (
          <div className={ItemStyle} key={name}>
            {fieldValue ? (
              <FormField
                name={`${cell}.customFields.fieldValues[${fieldValue.index}].value.string`}
                initValue={fieldValue.value.string}
                validator={validator}
                values={values}
              >
                {({ name: fieldName }) => (
                  <InlineTextInput name={fieldName} value={fieldValue.value.string} />
                )}
              </FormField>
            ) : (
              <TableDisableCell />
            )}
          </div>
        );
      })}
    </div>
  );
}
