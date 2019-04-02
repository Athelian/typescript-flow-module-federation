// @flow
import { diff } from 'deep-object-diff';
import { is, pipe, when, either, map, reject, isNil, isEmpty, omit } from 'ramda';
import logger from 'utils/logger';
import { type UserAvatarType } from 'types';
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

export const isForbidden = (data: ?Object): boolean => {
  if (!data) return false;
  return getByPathWithDefault(null, '__typename', data) === 'Forbidden';
};

// For String and Number fields. Can be used for Object in certain situations.
export const parseGenericField = (key: string, originalValue: ?any, newValue: ?any): Object => {
  if (!isEquals(originalValue, newValue)) return { [key]: newValue };
  return {};
};

// Use for Textarea fields. The native input cannot take null, so it will hard-code empty string. We should treat that data as null though.
export const parseMemoField = (key: string, originalMemo: ?string, newMemo: ?string): Object => {
  const parsedOriginalMemo = originalMemo === '' ? null : originalMemo;
  const parsedNewMemo = newMemo === '' ? null : newMemo;

  if (!isEquals(parsedOriginalMemo, parsedNewMemo)) return { [key]: parsedNewMemo };
  return {};
};

// Use for Enum fields. Cannot have empty string as value.
export const parseEnumField = (key: string, originalEnum: ?string, newEnum: ?string): Object => {
  const parsedOriginalEnum = originalEnum || null;
  const parsedNewEnum = newEnum || null;

  if (!isEquals(parsedOriginalEnum, parsedNewEnum)) return { [key]: parsedNewEnum };
  return {};
};

// Use for Date fields. Need to parse into Date object.
export const parseDateField = (key: string, originalDate: ?Date, newDate: ?string): Object => {
  const parsedOriginalDate = originalDate ? new Date(originalDate) : null;
  const parsedNewDate = newDate ? new Date(newDate) : null;

  if (!isEquals(parsedOriginalDate, parsedNewDate)) return { [key]: parsedNewDate };
  return {};
};

// Use for Array of Ids.
export const parseArrayOfIdsField = (
  key: string,
  originalArray: ?Array<Object>,
  newArray: Array<Object>
): Object => {
  const originalArrayOfIds = (originalArray || []).map(({ id }) => id);
  const newArrayOfIds = newArray.map(({ id }) => id);

  if (!isEquals(originalArrayOfIds, newArrayOfIds)) return { [key]: newArrayOfIds };
  return {};
};

// Use for Single Id.
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

// Use to apply nested logic to child entities. Look at existing uses to understand more how to use it.
export const parseArrayOfChildrenField = (
  key: string,
  originalChildren: ?Array<Object>,
  newChildren: Array<Object>,
  parseInside: (oldChild: ?Object, newChild: Object) => Object,
  forceSendIds: boolean = false
) => {
  if (!forceSendIds && isEquals(originalChildren, newChildren)) return {};

  const parsedNewChildren = newChildren.map(
    (newChild: Object): Array<Object> => {
      const oldChild =
        (originalChildren || []).find(
          (originalChild: Object): Object => originalChild.id === newChild.id
        ) || null;

      return parseInside(oldChild, newChild);
    }
  );

  return { [key]: parsedNewChildren };
};

type CustomFieldsType = {
  mask: ?Object,
  fieldValues: Array<{
    value: { string: ?string },
    fieldDefinition: Object,
  }>,
};

// Use for Custom Fields. If there is at least one change in fieldValues, we need to send all fieldValues.
export const parseCustomFieldsField = (
  key: string,
  originalCustomFields: ?CustomFieldsType,
  newCustomFields: CustomFieldsType
): Object => {
  if (isEquals(originalCustomFields, newCustomFields)) return {};

  const originalMaskId = getByPathWithDefault(null, 'mask.id', originalCustomFields);
  const newMaskId = getByPathWithDefault(null, 'mask.id', newCustomFields);

  const parsedOriginalFieldValues = getByPathWithDefault(
    [],
    'fieldValues',
    originalCustomFields
  ).map(fieldValue => {
    const value = { string: getByPathWithDefault(null, 'value.string', fieldValue) };
    const fieldDefinitionId = getByPathWithDefault(null, 'fieldDefinition.id', fieldValue);

    return { value, fieldDefinitionId };
  });
  const parsedNewFieldValues = getByPathWithDefault([], 'fieldValues', newCustomFields).map(
    fieldValue => {
      const value = { string: getByPathWithDefault(null, 'value.string', fieldValue) };
      const fieldDefinitionId = getByPathWithDefault(null, 'fieldDefinition.id', fieldValue);

      return { value, fieldDefinitionId };
    }
  );

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

type FilesType = {
  id: string,
  name: string,
  type: string,
  memo: ?string,
};

// Use for Documents fields. Need to send ids even for new files.
export const parseFilesField = (
  key: string,
  originalFiles: ?Array<FilesType>,
  newFiles: Array<FilesType>
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
        ...parseEnumField('status', getByPathWithDefault(null, 'status', oldFile), newFile.status),
        ...parseMemoField('memo', getByPathWithDefault(null, 'memo', oldFile), newFile.memo),
      };
    }
  ),
});

type ApprovalType = {
  approvedBy: {
    id: string,
  },
  approvedAt: string,
};

// Use for Approval fields. Need to send only approvedBy, not approvedAt.
export const parseApprovalField = (
  key: string,
  originalApproval: ?ApprovalType,
  newApproval: ?ApprovalType
): Object => {
  const originalApprovedById = getByPathWithDefault(null, 'approvedBy.id', originalApproval);
  const newApprovedById = getByPathWithDefault(null, 'approvedBy.id', newApproval);

  const originalApprovedAt =
    (originalApproval && originalApproval.approvedAt && new Date(originalApproval.approvedAt)) ||
    null;
  const newApprovedAt =
    (newApproval && newApproval.approvedAt && new Date(newApproval.approvedAt)) || null;

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

// Use for Representative Batch. Send index, not id.
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
type TaskType = {
  id: ?string,
  name: ?string,
  startDate: ?string,
  dueDate: ?string,
  assignedTo: Array<UserAvatarType>,
  inProgressBy: ?UserAvatarType,
  inProgressAt: ?string,
  completedBy: ?UserAvatarType,
  completedAt: ?string,
  memo: ?string,
  description: ?string,
};

// Use for Todo (Tasks) field. Make sure to send 'todo' which contains 'tasks'.
export const parseTasksField = (
  originalTodo: ?{
    tasks: Array<TaskType>,
    taskTemplate: ?{ id: string },
  },
  newTodo: {
    tasks: Array<TaskType>,
    taskTemplate: ?{ id: string },
  }
): Object => {
  if (isEquals(originalTodo, newTodo)) return {};

  const originalTasks = getByPathWithDefault([], 'tasks', originalTodo);
  const newTasks = newTodo.tasks;

  return {
    todo: {
      ...parseArrayOfChildrenField(
        'tasks',
        originalTasks,
        newTasks,
        (oldTask: ?Object, newTask: Object) => {
          return {
            ...(oldTask ? { id: oldTask.id } : {}),
            ...parseGenericField('name', getByPathWithDefault(null, 'name', oldTask), newTask.name),
            ...parseGenericField(
              'approvable',
              getByPathWithDefault(null, 'approvable', oldTask),
              newTask.approvable
            ),
            ...parseDateField(
              'startDate',
              getByPathWithDefault(null, 'startDate', oldTask),
              newTask.startDate
            ),
            ...parseDateField(
              'dueDate',
              getByPathWithDefault(null, 'dueDate', oldTask),
              newTask.dueDate
            ),
            ...parseArrayOfIdsField(
              'assignedToIds',
              getByPathWithDefault([], 'assignedTo', oldTask),
              newTask.assignedTo
            ),
            ...parseArrayOfIdsField(
              'approverIds',
              getByPathWithDefault([], 'approvers', oldTask),
              newTask.approvers
            ),
            ...parseParentIdField(
              'inProgressById',
              getByPathWithDefault(null, 'inProgressBy', oldTask),
              newTask.inProgressBy
            ),
            ...parseDateField(
              'inProgressAt',
              getByPathWithDefault(null, 'inProgressAt', oldTask),
              newTask.inProgressAt
            ),
            ...parseParentIdField(
              'completedById',
              getByPathWithDefault(null, 'completedBy', oldTask),
              newTask.completedBy
            ),
            ...parseDateField(
              'completedAt',
              getByPathWithDefault(null, 'completedAt', oldTask),
              newTask.completedAt
            ),
            ...parseParentIdField(
              'rejectedById',
              getByPathWithDefault(null, 'rejectedBy', oldTask),
              newTask.rejectedBy
            ),
            ...parseDateField(
              'rejectedAt',
              getByPathWithDefault(null, 'rejectedAt', oldTask),
              newTask.rejectedAt
            ),
            ...parseParentIdField(
              'approvedById',
              getByPathWithDefault(null, 'approvedBy', oldTask),
              newTask.approvedBy
            ),
            ...parseDateField(
              'approvedAt',
              getByPathWithDefault(null, 'approvedAt', oldTask),
              newTask.approvedAt
            ),
            ...parseMemoField('memo', getByPathWithDefault(null, 'memo', oldTask), newTask.memo),
            ...parseMemoField(
              'description',
              getByPathWithDefault(null, 'description', oldTask),
              newTask.description
            ),
            ...parseArrayOfIdsField(
              'tagIds',
              getByPathWithDefault([], 'tags', oldTask),
              newTask.tags
            ),
            ...parseParentIdField(
              'taskTemplateId',
              getByPathWithDefault(null, 'taskTemplate', oldTask),
              newTask.taskTemplate
            ),
          };
        }
      ),
      ...parseParentIdField(
        'taskTemplateId',
        getByPathWithDefault(null, 'taskTemplate', originalTodo),
        newTodo.taskTemplate
      ),
    },
  };
};

export const findChangeData = (originalValues: Object, newValues: Object) => {
  const changedData = diff(originalValues, newValues);
  logger.warn({
    changedData,
  });
  return Object.keys(changedData).reduce((result, key) => {
    return {
      ...result,
      [key]: newValues[key],
    };
  }, {});
};
