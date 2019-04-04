// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  // LOG
  create: {
    id: 'modules.timeline.create',
    defaultMessage: '{user} has created this {entityType}',
  },
  setField: {
    id: 'modules.timeline.setField',
    defaultMessage: '{user} has set {field} to {value}',
  },
  setChildField: {
    id: 'modules.timeline.setChildField',
    defaultMessage: '{user} has set {child} {field} to {value}',
  },
  clearField: {
    id: 'modules.timeline.clearField',
    defaultMessage: '{user} has cleared {field} (previous value: {value})',
  },
  clearChildField: {
    id: 'modules.timeline.clearChildField',
    defaultMessage: '{user} has cleared {child} {field} (previous value: {value})',
  },
  updateField: {
    id: 'modules.timeline.updateField',
    defaultMessage: '{user} has changed {field} from {oldValue} to {newValue}',
  },
  updateChildField: {
    id: 'modules.timeline.updateChildField',
    defaultMessage: '{user} has changed {child} {field} from {oldValue} to {newValue}',
  },
  archived: {
    id: 'modules.timeline.archived',
    defaultMessage: '{user} has archived this {entityType}',
  },
  archivedChild: {
    id: 'modules.timeline.archived',
    defaultMessage: '{user} has archived {child}',
  },
  unarchived: {
    id: 'modules.timeline.unarchived',
    defaultMessage: '{user} has activated this {entityType}',
  },
  unarchivedChild: {
    id: 'modules.timeline.unarchived',
    defaultMessage: '{user} has activated {child}',
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
  product: {
    id: 'modules.timeline.product',
    defaultMessage: 'product',
  },
  productProvider: {
    id: 'modules.timeline.productProvider',
    defaultMessage: 'end product',
  },
});
