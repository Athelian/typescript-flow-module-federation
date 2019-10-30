// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedName from 'components/FormattedName';
import Tag from 'components/Tag';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import User from './components/User';
import { ARCHIVED, CREATE, IN_CHARGES, TAGS, UNARCHIVED, UPDATE_FIELD } from './constants';
import type { LogItem } from './types';
import EntityIdentifier from './components/EntityIdentifier';
import { Value, ValueWrapper } from './components/Value';
import Field from './components/Field';
import messages from './messages';

export type LogFormatter = (log: LogItem) => *;

export const CreateFormatter = (log: LogItem): * => {
  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.entityType !== log.parentEntityType) {
    message = messages.createChild;
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  } else {
    message = messages.create;
    values = {
      ...values,
      entityType: <FormattedMessage {...messages[log.entityType]} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const UpdateFormatter = (log: LogItem): * => {
  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
    field: (
      <Field field={log.parameters.field.string} entityType={log.parameters.entity_type.string} />
    ),
  };

  if (log.parameters.old === null) {
    message = log.entityType === log.parentEntityType ? messages.setField : messages.setChildField;
    values = {
      ...values,
      value: <Value value={log.parameters.new} />,
    };
  } else if (log.parameters.new === null) {
    message =
      log.entityType === log.parentEntityType ? messages.clearField : messages.clearChildField;
    values = {
      ...values,
      value: <Value value={log.parameters.old} />,
    };
  } else {
    message =
      log.entityType === log.parentEntityType ? messages.updateField : messages.updateChildField;
    values = {
      ...values,
      oldValue: <Value value={log.parameters.old} />,
      newValue: <Value value={log.parameters.new} />,
    };
  }

  if (log.entityType !== log.parentEntityType) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const ArchivedFormatter = (log: LogItem): * => {
  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.entityType !== log.parentEntityType) {
    message = messages.archivedChild;
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  } else {
    message = messages.archived;
    values = {
      ...values,
      entityType: <FormattedMessage {...messages[log.entityType]} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const UnarchivedFormatter = (log: LogItem): * => {
  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.entityType !== log.parentEntityType) {
    message = messages.unarchivedChild;
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  } else {
    message = messages.unarchived;
    values = {
      ...values,
      entityType: <FormattedMessage {...messages[log.entityType]} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const TagsFormatter = (log: LogItem): * => {
  const added = getByPathWithDefault([], 'parameters.added.values', log);
  const removed = getByPathWithDefault([], 'parameters.removed.values', log);

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
    added: (
      <>
        {added.map(v => (
          <React.Fragment key={getByPath('entity.id', v)}>
            <Tag tag={v.entity} />{' '}
          </React.Fragment>
        ))}
      </>
    ),
    addedCount: added.length,
    removed: (
      <>
        {removed.map(v => (
          <React.Fragment key={getByPath('entity.id', v)}>
            <Tag tag={v.entity} />{' '}
          </React.Fragment>
        ))}
      </>
    ),
    removedCount: removed.length,
  };

  if (log.entityType !== log.parentEntityType) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  if (added.length > 0 && removed.length > 0) {
    message =
      log.entityType !== log.parentEntityType
        ? messages.addedAndRemovedTagsChild
        : messages.addedAndRemovedTags;
  } else if (added.length > 0) {
    message =
      log.entityType !== log.parentEntityType ? messages.addedTagsChild : messages.addedTags;
  } else {
    message =
      log.entityType !== log.parentEntityType ? messages.removedTagsChild : messages.removedTags;
  }

  return <FormattedMessage {...message} values={values} />;
};

export const InChargesFormatter = (log: LogItem): * => {
  const added = getByPathWithDefault([], 'parameters.added.values', log);
  const removed = getByPathWithDefault([], 'parameters.removed.values', log);

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
    added: (
      <>
        {added.map(v => (
          <React.Fragment key={getByPath('entity.id', v)}>
            <ValueWrapper>
              <FormattedName firstName={v.entity.firstName} lastName={v.entity.lastName} />
            </ValueWrapper>{' '}
          </React.Fragment>
        ))}
      </>
    ),
    removed: (
      <>
        {removed.map(v => (
          <React.Fragment key={getByPath('entity.id', v)}>
            <ValueWrapper>
              <FormattedName firstName={v.entity.firstName} lastName={v.entity.lastName} />
            </ValueWrapper>{' '}
          </React.Fragment>
        ))}
      </>
    ),
  };

  if (log.entityType !== log.parentEntityType) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  if (added.length > 0 && removed.length > 0) {
    message =
      log.entityType !== log.parentEntityType
        ? messages.addedAndRemovedInChargesChild
        : messages.addedAndRemovedInCharges;
  } else if (added.length > 0) {
    message =
      log.entityType !== log.parentEntityType
        ? messages.addedInChargesChild
        : messages.addedInCharges;
  } else {
    message =
      log.entityType !== log.parentEntityType
        ? messages.removedInChargesChild
        : messages.removedInCharges;
  }

  return <FormattedMessage {...message} values={values} />;
};

const DefaultFormatters = {
  [CREATE]: CreateFormatter,
  [UPDATE_FIELD]: UpdateFormatter,
  [ARCHIVED]: ArchivedFormatter,
  [UNARCHIVED]: UnarchivedFormatter,
  [TAGS]: TagsFormatter,
  [IN_CHARGES]: InChargesFormatter,
};

export default DefaultFormatters;
