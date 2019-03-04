// @flow
import { is, pipe, when, either, map, reject, isNil, isEmpty, omit } from 'ramda';
import { isEquals, getByPathWithDefault } from './fp';

export const replaceUndefined: Function = when(
  either(is(Array), is(Object)),
  pipe(
    map(x => (x === undefined ? null : x)),
    map(a => replaceUndefined(a))
  )
);

export const removeNulls: Function = when(
  either(is(Array), is(Object)),
  pipe(
    reject(isNil),
    map(a => removeNulls(a))
  )
);

export const removeEmpty: Function = when(
  either(is(Array), is(Object)),
  pipe(
    reject(isEmpty),
    map(a => removeEmpty(a))
  )
);

export const replaceEmptyString: Function = when(
  either(is(Array), is(Object)),
  pipe(
    map(x => (x === '' ? null : x)),
    map(a => replaceEmptyString(a))
  )
);

export const removeTypename: Function = when(
  either(is(Array), is(Object)),
  pipe(
    x => (is(Object, x) && !is(Array, x) ? omit(['__typename'], x) : x),
    map(a => removeTypename(a))
  )
);

export const removeId: Function = when(
  either(is(Array), is(Object)),
  pipe(
    x => (is(Object, x) && !is(Array, x) ? omit(['id'], x) : x),
    map(a => removeId(a))
  )
);

export const cleanUpData: Function = pipe(
  removeTypename,
  removeNulls
);

export const cleanFalsy: Function = pipe(
  removeNulls,
  removeEmpty
);

export const cleanUpFiles: Function = pipe(
  removeTypename,
  removeNulls,
  removeEmpty
);

// Works for string, number, and object in certain situations
export const parseGenericField = (key: string, originalValue: ?any, newValue: ?any): Object => {
  if (!isEquals(originalValue, newValue)) return { [key]: newValue };
  return {};
};

// Cannot have empty string as a value
export const parseEnumField = (key: string, originalEnum: ?string, newEnum: ?string): Object => {
  const parsedOriginalEnum = originalEnum || null;
  const parsedNewEnum = newEnum || null;

  if (!isEquals(parsedOriginalEnum, parsedNewEnum)) return { [key]: parsedNewEnum };
  return {};
};

// Back uses Date format, Front uses string format
export const parseDateField = (key: string, originalDate: ?Date, newDate: ?string): Object => {
  const parsedOriginalDate = originalDate ? new Date(originalDate) : null;
  const parsedNewDate = newDate ? new Date(newDate) : null;

  if (!isEquals(parsedOriginalDate, parsedNewDate)) return { [key]: parsedNewDate };
  return {};
};

// Return only ids of the array of objects
export const parseArrayOfIdsField = (
  key: string,
  originalArray: Array<Object>,
  newArray: Array<Object>
): Object => {
  const originalArrayOfIds = originalArray.map(({ id }) => id);
  const newArrayOfIds = newArray.map(({ id }) => id);

  if (!isEquals(originalArrayOfIds, newArrayOfIds)) return { [key]: newArrayOfIds };
  return {};
};

// Return id
export const parseParentIdField = (
  key: string,
  originalParent: ?Object,
  newParent: ?Object
): Object => {
  const originalParentId = getByPathWithDefault(null, 'id', originalParent);
  const newParentId = getByPathWithDefault(null, 'id', newParent);

  if (!isEquals(originalParentId, newParentId)) return { [key]: newParentId };
  return {};
};

// Return parsed array of children objects
export const parseArrayOfChildrenField = (
  key: string,
  originalChildren: Array<Object>,
  newChildren: Array<Object>,
  parseInside: (oldChild: ?Object, newChild: Object) => Object
) => {
  if (isEquals(originalChildren, newChildren)) return {};

  const parsedNewChildren = newChildren.map(
    (newChild: Object): Array<Object> => {
      const oldChild =
        originalChildren.find(
          (originalChild: Object): Object => originalChild.id === newChild.id
        ) || null;

      return parseInside(oldChild, newChild);
    }
  );

  return { [key]: parsedNewChildren };
};

// Have to return all fieldValues if there is at least one change in it
export const parseCustomFieldsField = (
  key: string,
  originalCustomFields: {
    mask: ?Object,
    fieldValues: Array<{
      value: { string: ?string },
      fieldDefinition: Object,
    }>,
  },
  newCustomFields: {
    mask: ?Object,
    fieldValues: Array<{
      value: { string: ?string },
      fieldDefinition: Object,
    }>,
  }
): Object => {
  if (isEquals(originalCustomFields, newCustomFields)) return {};

  const originalMaskId = getByPathWithDefault(null, 'mask.id', originalCustomFields);
  const newMaskId = getByPathWithDefault(null, 'mask.id', newCustomFields);

  const parsedOriginalFieldValues = originalCustomFields.fieldValues.map(fieldValue => {
    const value = { string: getByPathWithDefault(null, 'value.string', fieldValue) };
    const fieldDefinitionId = getByPathWithDefault(null, 'fieldDefinition.id', fieldValue);

    return { value, fieldDefinitionId };
  });
  const parsedNewFieldValues = newCustomFields.fieldValues.map(fieldValue => {
    const value = { string: getByPathWithDefault(null, 'value.string', fieldValue) };
    const fieldDefinitionId = getByPathWithDefault(null, 'fieldDefinition.id', fieldValue);

    return { value, fieldDefinitionId };
  });

  const parsedOriginalCustomFields = {
    maskId: originalMaskId,
    fieldValues: parsedOriginalFieldValues,
  };
  const parsedNewCustomFields = {
    maskId: newMaskId,
    fieldValues: parsedNewFieldValues,
  };

  if (!isEquals(parsedOriginalCustomFields, parsedNewCustomFields))
    return {
      [key]: {
        ...parseGenericField('maskId', originalMaskId, newMaskId),
        ...parseGenericField('fieldValues', parsedOriginalFieldValues, parsedNewFieldValues),
      },
    };
  return {};
};

// Have to return id even for new file
export const parseFilesField = (
  key: string,
  originalFiles: Array<{
    id: string,
    name: string,
    type: string,
    memo: ?string,
  }>,
  newFiles: Array<{
    id: string,
    name: string,
    type: string,
    memo: ?string,
  }>
): Object => ({
  ...parseArrayOfChildrenField(
    key,
    originalFiles,
    newFiles,
    (oldFile: ?Object, newFile: Object) => {
      return {
        id: newFile.id,
        ...parseGenericField('name', getByPathWithDefault(null, 'name', oldFile), newFile.name),
        ...parseEnumField('type', getByPathWithDefault(null, 'type', oldFile), newFile.type),
        ...parseGenericField('memo', getByPathWithDefault(null, 'memo', oldFile), newFile.memo),
      };
    }
  ),
});

// Return id of approver, not date
export const parseApprovalField = (
  key: string,
  originalApproval: ?{
    approvedBy: {
      id: string,
    },
    approvedAt: string,
  },
  newApproval: ?{
    approvedBy: {
      id: string,
    },
    approvedAt: string,
  }
): Object => {
  const originalApprovedById = getByPathWithDefault(null, 'approvedBy.id', originalApproval);
  const newApprovedById = getByPathWithDefault(null, 'approvedBy.id', newApproval);

  const originalApprovedAt = (originalApproval && new Date(originalApproval.approvedAt)) || null;
  const newApprovedAt = (newApproval && new Date(newApproval.approvedAt)) || null;

  const parsedOriginalApproval = {
    approvedById: originalApprovedById,
    approvedAt: originalApprovedAt,
  };
  const parsedNewApproval = {
    approvedById: newApprovedById,
    approvedAt: newApprovedAt,
  };

  if (!isEquals(parsedOriginalApproval, parsedNewApproval)) return { [key]: newApprovedById };
  return {};
};

// Return index of representative batch
export const parseRepresentativeBatchIndexField = (
  key: string,
  originalRepresentativeBatch: ?{
    id: string,
  },
  newRepresentativeBatch: ?{
    id: string,
  },
  batches: Array<Object>
): Object => {
  const originalRepresentativeBatchId = getByPathWithDefault(
    null,
    'id',
    originalRepresentativeBatch
  );
  const newRepresentativeBatchId = getByPathWithDefault(null, 'id', newRepresentativeBatch);

  if (isEquals(originalRepresentativeBatchId, newRepresentativeBatchId)) return {};

  let newRepresentativeBatchIndex = batches.findIndex(
    batch => batch.id === newRepresentativeBatchId
  );
  if (newRepresentativeBatchIndex === -1) newRepresentativeBatchIndex = null;

  return { [key]: newRepresentativeBatchIndex };
};
