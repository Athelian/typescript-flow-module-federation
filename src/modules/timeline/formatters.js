/* eslint-disable class-methods-use-this,no-underscore-dangle */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedName from 'components/FormattedName';
import Tag from 'components/Tag';
import User from './components/User';
import { ARCHIVED, CREATE, IN_CHARGES, TAGS, UNARCHIVED, UPDATE_FIELD } from './contants';
import type { LogItem } from './types';
import EntityIdentifier from './components/EntityIdentifier';
import { Value, ValueWrapper } from './components/Value';
import Field from './components/Field';
import messages from './messages';

export type LogFormatter = (log: LogItem) => *;

export const CreateFormatter = (log: LogItem): * => {
  const entityType = log.entity.__typename.charAt(0).toLowerCase() + log.entity.__typename.slice(1);

  return (
    <FormattedMessage
      {...messages.create}
      values={{
        user: <User user={log.createdBy} />,
        entityType: <FormattedMessage {...messages[entityType]} />,
      }}
    />
  );
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
    message =
      log.entity.__typename === log.parentEntity.__typename
        ? messages.setField
        : messages.setChildField;
    values = {
      ...values,
      value: <Value value={log.parameters.new} />,
    };
  } else if (log.parameters.new === null) {
    message =
      log.entity.__typename === log.parentEntity.__typename
        ? messages.clearField
        : messages.clearChildField;
    values = {
      ...values,
      value: <Value value={log.parameters.old} />,
    };
  } else {
    message =
      log.entity.__typename === log.parentEntity.__typename
        ? messages.updateField
        : messages.updateChildField;
    values = {
      ...values,
      oldValue: <Value value={log.parameters.old} />,
      newValue: <Value value={log.parameters.new} />,
    };
  }

  if (log.entity.__typename !== log.parentEntity.__typename) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const ArchivedFormatter = (log: LogItem): * => {
  const entityType = log.entity.__typename.charAt(0).toLowerCase() + log.entity.__typename.slice(1);

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.entity.__typename !== log.parentEntity.__typename) {
    message = messages.archivedChild;
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  } else {
    message = messages.archived;
    values = {
      ...values,
      entityType: <FormattedMessage {...messages[entityType]} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const UnarchivedFormatter = (log: LogItem): * => {
  const entityType = log.entity.__typename.charAt(0).toLowerCase() + log.entity.__typename.slice(1);

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.entity.__typename !== log.parentEntity.__typename) {
    message = messages.unarchivedChild;
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  } else {
    message = messages.unarchived;
    values = {
      ...values,
      entityType: <FormattedMessage {...messages[entityType]} />,
    };
  }

  return <FormattedMessage {...message} values={values} />;
};

export const TagsFormatter = (log: LogItem): * => {
  const added = log.parameters.added ? log.parameters.added.values : [];
  const removed = log.parameters.removed ? log.parameters.removed.values : [];

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
    added: (
      <>
        {added.map(v => (
          <React.Fragment key={v.entity.id}>
            <Tag tag={v.entity} />{' '}
          </React.Fragment>
        ))}
      </>
    ),
    addedCount: added.length,
    removed: (
      <>
        {removed.map(v => (
          <React.Fragment key={v.entity.id}>
            <Tag tag={v.entity} />{' '}
          </React.Fragment>
        ))}
      </>
    ),
    removedCount: removed.length,
  };

  if (log.entity.__typename !== log.parentEntity.__typename) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  if (added.length > 0 && removed.length > 0) {
    message =
      log.entity.__typename !== log.parentEntity.__typename
        ? messages.addedAndRemovedTagsChild
        : messages.addedAndRemovedTags;
  } else if (added.length > 0) {
    message =
      log.entity.__typename !== log.parentEntity.__typename
        ? messages.addedTagsChild
        : messages.addedTags;
  } else {
    message =
      log.entity.__typename !== log.parentEntity.__typename
        ? messages.removedTagsChild
        : messages.removedTags;
  }

  return <FormattedMessage {...message} values={values} />;
};

export const InChargesFormatter = (log: LogItem): * => {
  const added = log.parameters.added ? log.parameters.added.values : [];
  const removed = log.parameters.removed ? log.parameters.removed.values : [];

  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
    added: (
      <>
        {added.map(v => (
          <React.Fragment key={v.entity.id}>
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
          <React.Fragment key={v.entity.id}>
            <ValueWrapper>
              <FormattedName firstName={v.entity.firstName} lastName={v.entity.lastName} />
            </ValueWrapper>{' '}
          </React.Fragment>
        ))}
      </>
    ),
  };

  if (log.entity.__typename !== log.parentEntity.__typename) {
    values = {
      ...values,
      child: <EntityIdentifier log={log} />,
    };
  }

  if (added.length > 0 && removed.length > 0) {
    message =
      log.entity.__typename !== log.parentEntity.__typename
        ? messages.addedAndRemovedInChargesChild
        : messages.addedAndRemovedInCharges;
  } else if (added.length > 0) {
    message =
      log.entity.__typename !== log.parentEntity.__typename
        ? messages.addedInChargesChild
        : messages.addedInCharges;
  } else {
    message =
      log.entity.__typename !== log.parentEntity.__typename
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
