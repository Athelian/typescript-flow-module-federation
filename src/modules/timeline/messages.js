// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  // LOG
  setField: {
    id: 'modules.timeline.setField',
    defaultMessage: '{user} has set {field} to {value}',
  },
  updateField: {
    id: 'modules.timeline.updateField',
    defaultMessage: '{user} has set {field} from {oldValue} to {newValue}',
  },
  archived: {
    id: 'modules.timeline.archived',
    defaultMessage: '{user} has archived this {entityType}',
  },
  unarchived: {
    id: 'modules.timeline.unarchived',
    defaultMessage: '{user} has activated this {entityType}',
  },
  // OTHER
  message: {
    id: 'modules.timeline.message',
    defaultMessage: 'MESSAGE',
  },
  commentEdited: {
    id: 'modules.timeline.commentEdited',
    defaultMessage: '{date} {time} edited',
  },
  order: {
    id: 'modules.timeline.order',
    defaultMessage: 'order',
  },
  shipment: {
    id: 'modules.timeline.shipment',
    defaultMessage: 'shipment',
  },
});
