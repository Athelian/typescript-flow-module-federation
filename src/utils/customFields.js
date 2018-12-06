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

export const list2Map = (list: Array<Object>): Map<string, Object> => {
  const map = new Map();
  list.forEach(({ fieldDefinition, ...rest }, index) => {
    map.set(fieldDefinition.id, { fieldDefinition, ...rest, index });
  });
  return map;
};
