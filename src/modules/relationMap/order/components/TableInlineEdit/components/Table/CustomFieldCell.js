// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import InlineTextInput from 'modules/relationMap/order/components/TableInlineEdit/components/TableItem/components/InlineTextInput';
import { WrapperStyle, ItemStyle } from './style';

type OptionalProps = {
  id: string,
};

type Props = OptionalProps & {
  cell: string,
  inputId: string,
  values: ?Object,
  validator: Object,
};

function CustomFieldCell({ cell, values, validator, id, inputId }: Props) {
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
  const { fieldValues, mask } = customFields;
  const fieldValue = fieldValues.find(
    ({ fieldDefinition }) => fieldDefinition && fieldDefinition.id === id
  );
  const findPosition = fieldValues.findIndex(({ fieldDefinition }) => fieldDefinition.id === id);
  return (
    <div className={WrapperStyle}>
      <div className={ItemStyle} key={inputId}>
        <FormField
          name={`${cell}.customFields.fieldValues[${findPosition}].value.string`}
          initValue={getByPathWithDefault('', 'value.string', fieldValue)}
          validator={validator}
          values={values}
        >
          {({ name: fieldName }) => (
            <InlineTextInput
              name={fieldName}
              value={getByPathWithDefault('', 'value.string', fieldValue)}
              disabled={mask && !fieldValue}
              id={inputId}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}

CustomFieldCell.defaultProps = {
  id: '',
};

export default CustomFieldCell;
