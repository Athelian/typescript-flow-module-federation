// @flow
import { removeTypename } from 'utils/data';

export function normalizeCustomValuesInput(
  entity: Object,
  fieldDefinitionId: string,
  value: any
): Object {
  let hasFieldValue = false;
  const fieldValues = (entity?.customFields?.fieldValues ?? []).map(fv => {
    if (fv.fieldDefinition.id === fieldDefinitionId) {
      hasFieldValue = true;
      return {
        value: value
          ? {
              string: value,
            }
          : null,
        fieldDefinitionId,
      };
    }

    return {
      value: removeTypename(fv.value),
      fieldDefinitionId: fv.fieldDefinition.id,
    };
  });

  if (!hasFieldValue) {
    fieldValues.push({
      value: value
        ? {
            string: value,
          }
        : null,
      fieldDefinitionId,
    });
  }

  return {
    customFields: {
      fieldValues,
    },
  };
}

export function normalizeSheetInput(entity: Object, field: string, value: any): Object {
  if (field.charAt(0) === '@') {
    return normalizeCustomValuesInput(entity, field.substr(1), value);
  }

  return {
    [field]: value,
  };
}
