// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import CustomFieldsProvider from 'providers/customFields';
import CustomFieldsInput from './CustomFieldsInput';

type OptionalProps = {
  isNew: boolean,
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

const defaultProps = {
  isNew: false,
};

const CustomFieldsFactory = ({
  isNew,
  entityType,
  customFields,
  setFieldValue,
  editable,
}: Props): React.Node => {
  const { fieldDefinitions: originalFieldDefinitions, mask, fieldValues } = customFields;
  if (isNew) {
    return (
      <CustomFieldsProvider entityType={entityType}>
        {({ error, loading, data: fieldDefinitions }) => {
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
              fieldDefinitions={fieldDefinitions}
              mask={mask}
              fieldValues={fieldValues}
              setFieldValue={setFieldValue}
              editable={editable}
            />
          );
        }}
      </CustomFieldsProvider>
    );
  }
  return (
    <CustomFieldsInput
      entityType={entityType}
      fieldDefinitions={originalFieldDefinitions}
      mask={mask}
      fieldValues={fieldValues}
      setFieldValue={setFieldValue}
      editable={editable}
    />
  );
};

CustomFieldsFactory.defaultProps = defaultProps;

export default CustomFieldsFactory;
