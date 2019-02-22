// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { WrapperStyle, ItemStyle } from './style';
import InlineTextInput from './components/InlineTextInput';

type OptionalProps = {
  columnNo: number,
};
type Props = OptionalProps & {
  cell: string,
  fields: Array<{
    id: string,
    name: string,
    entityType: string,
    sort: Object,
  }>,
  rowNo: number,
  values: ?Object,
  validator: Object,
};

const defaultProps = {
  columnNo: 0,
};
function TableItemForCustomFields({ cell, fields, values, validator, rowNo, columnNo }: Props) {
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
  return (
    <div className={WrapperStyle}>
      {fields.map(({ id }, fieldCounter) => {
        const fieldValue = fieldValues.find(({ fieldDefinition }) => fieldDefinition.id === id);
        const findPosition = fieldValues.findIndex(
          ({ fieldDefinition }) => fieldDefinition.id === id
        );
        const inputId = `${rowNo}-${fieldCounter + columnNo + 1}`;
        return (
          <div className={ItemStyle} key={inputId}>
            <FormField
              name={`${cell}.customFields.fieldValues[${findPosition}].value.string`}
              initValue={fieldValue ? fieldValue.value.string : ''}
              validator={validator}
              values={values}
            >
              {({ name: fieldName }) => (
                <InlineTextInput
                  name={fieldName}
                  value={fieldValue ? fieldValue.value.string : ''}
                  disabled={!fieldValue}
                  id={inputId}
                />
              )}
            </FormField>
          </div>
        );
      })}
    </div>
  );
}
TableItemForCustomFields.defaultProps = defaultProps;
export default TableItemForCustomFields;
