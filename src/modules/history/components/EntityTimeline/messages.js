// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  cancel: {
    id: 'components.EntityTimeline.cancel',
    defaultMessage: 'CANCEL',
  },
  defaultEvent: {
    id: 'components.EntityTimeline.defaultEvent',
    defaultMessage: '{user} did an update',
  },
  updateEvent: {
    id: 'components.EntityTimeline.updateEvent',
    defaultMessage: '{user} updated {target} {field} from {oldValue} to {newValue}',
  },
  updateEventSet: {
    id: 'components.EntityTimeline.updateEventSet',
    defaultMessage: '{user} set {target} {field} to {newValue}',
  },
  multipleUpdateEvent: {
    id: 'components.EntityTimeline.multipleUpdateEvent',
    defaultMessage: '{user} updated {target} {count} fields',
  },
  multipleUpdateEventChange: {
    id: 'components.EntityTimeline.multipleUpdateEventChange',
    defaultMessage: '{field} from {oldValue} to {newValue}',
  },
  multipleUpdateEventChangeSet: {
    id: 'components.EntityTimeline.multipleUpdateEventChangeSet',
    defaultMessage: '{field} set to {newValue}',
  },
  OrderItem: {
    id: 'components.EntityTimeline.target.OrderItem',
    defaultMessage: ' item "{identifier}"',
  },
  BatchItem: {
    id: 'components.EntityTimeline.target.BatchItem',
    defaultMessage: ' batch "{identifier}"',
  },
  Voyage: {
    id: 'components.EntityTimeline.target.Voyage',
    defaultMessage: 'Voyage "{identifier}"',
  },
  ContainerGroup: {
    id: 'components.EntityTimeline.target.ContainerGroup',
    defaultMessage: 'Container Group',
  },
  BatchGroup: {
    id: 'components.EntityTimeline.target.BatchGroup',
    defaultMessage: 'Batch Group',
  },
});
