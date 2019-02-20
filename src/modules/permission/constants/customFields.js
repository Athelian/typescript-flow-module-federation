export const CUSTOM_FIELD_DEFINITIONS_LIST = 'customFields.fieldDefinitions.list';
export const CUSTOM_FIELD_DEFINITIONS_CREATE = 'customFields.fieldDefinitions.create';
export const CUSTOM_FIELD_DEFINITIONS_UPDATE = 'customFields.fieldDefinitions.update';
export const CUSTOM_FIELD_DEFINITIONS_DELETE = 'customFields.fieldDefinitions.delete';
export const CUSTOM_FIELD_MASKS_LIST = 'customFields.masks.list';
export const CUSTOM_FIELD_MASKS_GET = 'customFields.masks.get';
export const CUSTOM_FIELD_MASKS_CREATE = 'customFields.masks.create';
export const CUSTOM_FIELD_MASKS_UPDATE = 'customFields.masks.update';

const customFields = {
  default: [CUSTOM_FIELD_DEFINITIONS_LIST, CUSTOM_FIELD_MASKS_LIST, CUSTOM_FIELD_MASKS_GET],
  manager: [
    CUSTOM_FIELD_DEFINITIONS_LIST,
    CUSTOM_FIELD_DEFINITIONS_CREATE,
    CUSTOM_FIELD_DEFINITIONS_UPDATE,
    CUSTOM_FIELD_DEFINITIONS_DELETE,
    CUSTOM_FIELD_MASKS_LIST,
    CUSTOM_FIELD_MASKS_GET,
    CUSTOM_FIELD_MASKS_CREATE,
    CUSTOM_FIELD_MASKS_UPDATE,
  ],
};

export default customFields;
