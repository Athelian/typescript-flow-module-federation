// @flow
export const prepareCustomFieldsData = (customFields: Object) =>
  customFields
    ? {
        maskId: customFields.mask ? customFields.mask.id : null,
        fieldValues: customFields.fieldValues.map(fieldValue => ({
          value: { string: fieldValue.value.string },
          fieldDefinitionId: fieldValue.fieldDefinition.id,
        })),
      }
    : null;

export default prepareCustomFieldsData;
