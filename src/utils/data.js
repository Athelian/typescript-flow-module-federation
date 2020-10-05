// @flow
import type { Task, MetricValue } from 'generated/graphql';
import { diff } from 'deep-object-diff';
import { is, pipe, when, either, map, reject, isNil, isEmpty, omit, has } from 'ramda';
import logger from 'utils/logger';
import { isDateObject } from './date';
import { defaultDistanceMetric } from './metric';
import { isEquals, getByPathWithDefault, getByPath } from './fp';

export const replaceUndefined: Function = when(
  either(is(Array), is(Object)),
  pipe(
    map(x => (x === undefined ? null : x)),
    map(a => replaceUndefined(a))
  )
);

export const removeNulls: Function = when(
  value => is(Array, value) || (is(Object, value) && !isDateObject(value)),
  pipe(
    reject(isNil),
    map(a => removeNulls(a))
  )
);

export const removeEmpty: Function = when(
  value => is(Array, value) || (is(Object, value) && !isDateObject(value)),
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
  value => is(Array, value) || (is(Object, value) && !isDateObject(value)),
  pipe(
    x => (is(Object, x) && !is(Array, x) && has('__typename', x) ? omit(['__typename'], x) : x),
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

export const cleanUpData: Function = pipe(removeTypename, removeNulls);

export const cleanFalsyAndTypeName: Function = pipe(removeTypename, removeNulls, removeEmpty);

export const isForbidden = (data: Object): boolean => {
  return getByPath('__typename', data) === 'Forbidden';
};

export const isNotFound = (data: Object): boolean => {
  return getByPath('__typename', data) === 'NotFound';
};

export const isBadRequest = (data: Object): boolean => {
  return getByPath('__typename', data) === 'BadRequest';
};

export const extractForbiddenId = (data: Object): Object => {
  if (isForbidden(data)) {
    const id = getByPathWithDefault(null, 'reference.id', data);
    if (id) {
      return { ...data, id };
    }
  }
  return data;
};

// For String and Number fields. Can be used for Object in certain situations.
export const parseGenericField = (key: string, originalValue: ?any, newValue: ?any): Object => {
  if (!isEquals(originalValue, newValue)) {
    return { [key]: newValue };
  }
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
export const parseDateField = (key: string, originalDate: ?string, newDate: ?string): Object => {
  const parsedOriginalDate = originalDate ? new Date(originalDate) : null;
  const parsedNewDate = newDate ? new Date(newDate) : null;

  if (!isEquals(parsedOriginalDate, parsedNewDate)) return { [key]: parsedNewDate };
  return {};
};

// Use for Datetime fields.
export const parseDatetimeField = (
  key: string,
  originalDate: ?string,
  newDate: ?string
): Object => {
  const parsedOriginalDate = originalDate || null;
  const parsedNewDate = newDate || null;

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

  const parsedNewChildren = newChildren.map((newChild: Object): Array<Object> => {
    const oldChild =
      (originalChildren || []).find(
        (originalChild: Object): Object => originalChild.id === newChild.id
      ) || null;

    return parseInside(oldChild, newChild);
  });

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
        ...parseMemoField('memo', getByPathWithDefault(null, 'memo', oldFile), newFile.memo),
        ...parseArrayOfIdsField('tagIds', getByPathWithDefault([], 'tags', oldFile), newFile.tags),
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
export const parseDefaultIndexField = (
  key: string,
  originalValues: ?{
    id: string,
  },
  newValues: ?{
    id: string,
  },
  sources: Array<Object>
): Object => {
  const originalValuesId = getByPathWithDefault(null, 'id', originalValues);
  const newValuesId = getByPathWithDefault(null, 'id', newValues);

  if (isEquals(originalValuesId, newValuesId)) return {};

  let newValuesIndex = sources.findIndex(item => item.id === newValuesId);
  if (newValuesIndex === -1) newValuesIndex = null;

  return { [key]: newValuesIndex };
};

const parseDateFieldForTask = (key: string, originalTask: ?Task, newTask: Task): Object => {
  if (newTask[`${key}Interval`] || newTask[`${key}Binding`]) {
    return {};
  }

  return {
    ...parseDatetimeField(key, originalTask?.[key] ?? null, newTask[key]),
  };
};

// Used only in Task Form. For tasks inside other entities, use parseTodoField function.
export const parseTaskField = (
  originalTask: ?Task,
  newTask: Task,
  isInProject: boolean = false
): Object => {
  if (isEquals(originalTask, newTask)) return {};

  return {
    ...parseGenericField('name', getByPathWithDefault(null, 'name', originalTask), newTask.name),
    ...parseDateFieldForTask('startDate', originalTask, newTask),
    ...parseGenericField(
      'startDateInterval',
      getByPathWithDefault(null, 'startDateInterval', originalTask),
      newTask.startDateInterval
    ),
    ...parseEnumField(
      'startDateBinding',
      getByPathWithDefault(null, 'startDateBinding', originalTask),
      newTask.startDateBinding
    ),
    ...parseDateFieldForTask('dueDate', originalTask, newTask),
    ...parseGenericField(
      'dueDateInterval',
      getByPathWithDefault(null, 'dueDateInterval', originalTask),
      newTask.dueDateInterval
    ),
    ...parseEnumField(
      'dueDateBinding',
      getByPathWithDefault(null, 'dueDateBinding', originalTask),
      newTask.dueDateBinding
    ),
    ...parseParentIdField(
      'inProgressById',
      getByPathWithDefault(null, 'inProgressBy', originalTask),
      newTask.inProgressBy
    ),
    ...parseDatetimeField('inProgressAt', originalTask?.inProgressAt ?? null, newTask.inProgressAt),
    ...parseParentIdField(
      'completedById',
      getByPathWithDefault(null, 'completedBy', originalTask),
      newTask.completedBy
    ),
    ...parseDatetimeField('completedAt', originalTask?.completedAt ?? null, newTask.completedAt),
    ...parseParentIdField(
      'skippedById',
      getByPathWithDefault(null, 'skippedBy', originalTask),
      newTask.skippedBy
    ),
    ...parseDatetimeField('skippedAt', originalTask?.skippedAt ?? null, newTask.skippedAt),
    ...parseGenericField(
      'approvable',
      getByPathWithDefault(null, 'approvable', originalTask),
      newTask.approvable
    ),
    ...parseArrayOfIdsField(
      'approverIds',
      getByPathWithDefault([], 'approvers', originalTask),
      newTask.approvers
    ),
    ...parseParentIdField(
      'approvedById',
      getByPathWithDefault(null, 'approvedBy', originalTask),
      newTask.approvedBy
    ),
    ...parseDatetimeField('approvedAt', originalTask?.approvedAt ?? null, newTask.approvedAt),
    ...parseParentIdField(
      'rejectedById',
      getByPathWithDefault(null, 'rejectedBy', originalTask),
      newTask.rejectedBy
    ),
    ...parseDatetimeField('rejectedAt', originalTask?.rejectedAt ?? null, newTask.rejectedAt),
    ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalTask), newTask.memo),
    ...parseMemoField(
      'description',
      getByPathWithDefault(null, 'description', originalTask),
      newTask.description
    ),
    ...parseArrayOfIdsField('tagIds', getByPathWithDefault([], 'tags', originalTask), newTask.tags),
    ...parseParentIdField(
      'taskTemplateId',
      getByPathWithDefault(null, 'taskTemplate', originalTask),
      newTask.taskTemplate
    ),
    ...(!isInProject
      ? parseParentIdField(
          'milestoneId',
          getByPathWithDefault(null, 'milestone', originalTask),
          newTask.milestone
        )
      : {}),
  };
};

// Use for Todo (Tasks) field. Make sure to send 'todo' which contains 'tasks'.
export const parseTodoField = (
  originalTodo: ?{
    tasks: Array<Task>,
    taskTemplate: ?{ id: string },
  },
  newTodo: {
    tasks: Array<Task>,
    taskTemplate: ?{ id: string },
  }
): Object => {
  if (isEquals(originalTodo, newTodo)) return {};

  return {
    todo: {
      ...parseArrayOfChildrenField(
        'tasks',
        getByPathWithDefault([], 'tasks', originalTodo),
        newTodo.tasks,
        (oldTask: ?Task, newTask: Task) => ({
          ...(oldTask ? { id: oldTask.id } : {}),
          ...parseTaskField(oldTask, newTask),
        })
      ),
      ...parseParentIdField(
        'taskTemplateId',
        getByPathWithDefault(null, 'taskTemplate', originalTodo),
        newTodo.taskTemplate
      ),
      ...parseParentIdField(
        'milestoneId',
        getByPathWithDefault(null, 'milestone', originalTodo),
        newTodo.milestone
      ),
    },
  };
};

// For Size fields (length, width, height). Needs to handle case when null, need to inject default values for all.
export const parseSizeField = (
  key: string,
  originalSize: ?{
    height?: MetricValue,
    width?: MetricValue,
    length?: MetricValue,
  },
  newSize: { height?: MetricValue, width?: MetricValue, length?: MetricValue }
): Object => {
  if (isEquals(originalSize, newSize)) return {};

  return {
    [key]: {
      height: getByPathWithDefault({ value: 0, metric: defaultDistanceMetric }, 'height', newSize),
      width: getByPathWithDefault({ value: 0, metric: defaultDistanceMetric }, 'width', newSize),
      length: getByPathWithDefault({ value: 0, metric: defaultDistanceMetric }, 'length', newSize),
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
