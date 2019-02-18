export const CUSTOM_FIELD_DEFINITIONS_LIST = 'customField.fieldDefinitions.list';
export const CUSTOM_FIELD_DEFINITIONS_CREATE = 'customField.fieldDefinitions.create';
export const CUSTOM_FIELD_DEFINITIONS_UPDATE = 'customField.fieldDefinitions.update';
export const CUSTOM_FIELD_DEFINITIONS_DELETE = 'customField.fieldDefinitions.delete';
export const CUSTOM_FIELD_MASKS_CREATE = 'customField.masks.create';
export const CUSTOM_FIELD_MASKS_UPDATE = 'customField.masks.update';

const customFields = {
  default: [CUSTOM_FIELD_DEFINITIONS_LIST],
  manager: [
    CUSTOM_FIELD_DEFINITIONS_LIST,
    CUSTOM_FIELD_DEFINITIONS_CREATE,
    CUSTOM_FIELD_DEFINITIONS_UPDATE,
    CUSTOM_FIELD_DEFINITIONS_DELETE,
    CUSTOM_FIELD_MASKS_CREATE,
    CUSTOM_FIELD_MASKS_UPDATE,
  ],
};

export default customFields;
