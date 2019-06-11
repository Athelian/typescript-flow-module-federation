// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import CustomFieldsProvider from 'providers/customFields';
import CustomFieldsInput from './CustomFieldsInput';

type OptionalProps = {
  editable: {
    values: boolean,
    mask: boolean,
  },
};

type Props = OptionalProps & {
  entityType: string,
  customFields: {
    mask: ?Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
  setFieldValue: Function,
};

const CustomFieldsFactory = ({
  entityType,
  customFields,
  setFieldValue,
  editable,
}: Props): React.Node => {
  const { fieldDefinitions, mask, fieldValues } = customFields;
  if (fieldDefinitions) {
    return (
      <CustomFieldsInput
        entityType={entityType}
        fieldDefinitions={fieldDefinitions}
        mask={mask}
        fieldValues={fieldValues}
        setFieldValue={setFieldValue}
        editable={editable}
      />
    );
  }
  return (
    <CustomFieldsProvider entityType={entityType}>
      {({ error, loading, data }) => {
        if (error) {
          if (error.message && error.message.includes('403')) {
            navigate('/403');
          }
          return error.message;
        }

        return (
          <CustomFieldsInput
            loading={loading}
            entityType={entityType}
            fieldDefinitions={data}
            mask={mask}
            fieldValues={fieldValues}
            setFieldValue={setFieldValue}
            editable={editable}
          />
        );
      }}
    </CustomFieldsProvider>
  );
};

export default CustomFieldsFactory;
