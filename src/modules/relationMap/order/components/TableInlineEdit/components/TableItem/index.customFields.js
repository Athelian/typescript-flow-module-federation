// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { list2Map } from 'utils/customFields';
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
  const fieldValueMap = list2Map(fieldValues);
  return (
    <div className={WrapperStyle}>
      {fields.map(({ id }, fieldCounter) => {
        const fieldValue = fieldValueMap.get(id);
        const inputId = `${rowNo}-${fieldCounter + columnNo + 1}`;
        return (
          <div className={ItemStyle} key={id}>
            <FormField
              name={`${cell}.customFields.fieldValues[${fieldCounter}].value.string`}
              initValue={fieldValue ? fieldValue.value.string : ''}
              validator={validator}
              values={values}
              id={inputId}
              cachedFields={['id']}
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
