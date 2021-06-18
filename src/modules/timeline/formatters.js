// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import Tag from 'components/Tag';
import User from './components/User';
import {
  ARCHIVED,
  CREATE,
  TAGS,
  DOCUMENTS,
  FORWARDERS,
  UNARCHIVED,
  UPDATE_FIELD,
  REVISE_DATE,
  UN_REVISE_DATE,
} from './constants';
import type { LogItem } from './types';
import EntityIdentifier from './components/EntityIdentifier';
import Value from './components/Value';
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
      value: <Value value={log.parameters.new} entityType={log.parameters.entity_type.string} />,
    };
  } else if (log.parameters.new === null) {
    message =
      log.entityType === log.parentEntityType ? messages.clearField : messages.clearChildField;
    values = {
      ...values,
      value: <Value value={log.parameters.old} entityType={log.parameters.entity_type.string} />,
    };
  } else {
    message =
      log.entityType === log.parentEntityType ? messages.updateField : messages.updateChildField;
    values = {
      ...values,
      oldValue: <Value value={log.parameters.old} entityType={log.parameters.entity_type.string} />,
      newValue: <Value value={log.parameters.new} entityType={log.parameters.entity_type.string} />,
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

export const ForwardersFormatter = (log: LogItem): * => {
  const added = getByPathWithDefault([], 'parameters.added.values', log);
  const removed = getByPathWithDefault([], 'parameters.removed.values', log);

  let message = null;
  const values = {
    user: <User user={log.createdBy} />,
    added: (
      <>
        {added.map(v => (
          <Value value={v.entity?.partner?.name || v.entity?.name} />
        ))}
      </>
    ),
    addedCount: added.length,
    removed: (
      <>
        {removed.map(v => (
          <Value value={v.entity?.partner?.name || v.entity?.name} />
        ))}
      </>
    ),
    removedCount: removed.length,
    field: <Field field="forwarder" entityType={log.parameters.entity_type.string} />,
  };

  if (added.length > 0 && removed.length > 0) {
    message = messages.addedAndRemovedForwarders;
  } else if (added.length > 0) {
    message = messages.addedForwarders;
  } else {
    message = messages.removedForwarders;
  }

  return <FormattedMessage {...message} values={values} />;
};

export const DocumentsFormatter = (log: LogItem): * => {
  let message = null;
  let values = {
    user: <User user={log.createdBy} />,
  };

  if (log.parameters.old === null) {
    message = messages.addedDocumentChild;
    values = {
      ...values,
      value: <Value value={log.parameters.new} />,
    };
  } else {
    message = messages.removedDocumentChild;
    values = {
      ...values,
      value: <Value value={log.parameters.old} />,
    };
  }

  values = {
    ...values,
    child: <EntityIdentifier log={log} />,
    documentType: (
      <Value value={log.parameters.document_type} entityType={log.parameters.entity_type.string} />
    ),
  };

  return <FormattedMessage {...message} values={values} />;
};

export const ReviseDateFormatter = (log: LogItem): * => {
  return (
    <FormattedMessage
      {...messages.reviseDateChild}
      values={{
        user: <User user={log.createdBy} />,
        child: <EntityIdentifier log={log} />,
        date: <Value value={log.parameters.date} />,
        reviseType: <Value value={log.parameters.revise_type} />,
      }}
    />
  );
};

export const UnReviseDateFormatter = (log: LogItem): * => {
  return (
    <FormattedMessage
      {...messages.unReviseDateChild}
      values={{
        user: <User user={log.createdBy} />,
        child: <EntityIdentifier log={log} />,
        reviseType: <Value value={log.parameters.revise_type} />,
      }}
    />
  );
};

const DefaultFormatters = {
  [CREATE]: CreateFormatter,
  [UPDATE_FIELD]: UpdateFormatter,
  [ARCHIVED]: ArchivedFormatter,
  [UNARCHIVED]: UnarchivedFormatter,
  [TAGS]: TagsFormatter,
  [DOCUMENTS]: DocumentsFormatter,
  [FORWARDERS]: ForwardersFormatter,
  [REVISE_DATE]: ReviseDateFormatter,
  [UN_REVISE_DATE]: UnReviseDateFormatter,
};

export default DefaultFormatters;
