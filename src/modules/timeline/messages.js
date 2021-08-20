// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  // LOG
  create: {
    id: 'modules.timeline.create',
    defaultMessage: '{user} has created this {entityType}',
  },
  createChild: {
    id: 'modules.timeline.createChild',
    defaultMessage: '{user} has created {child}',
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
    id: 'modules.timeline.archivedChild',
    defaultMessage: '{user} has archived {child}',
  },
  unarchived: {
    id: 'modules.timeline.unarchived',
    defaultMessage: '{user} has activated this {entityType}',
  },
  unarchivedChild: {
    id: 'modules.timeline.unarchivedChild',
    defaultMessage: '{user} has activated {child}',
  },
  addedTags: {
    id: 'modules.timeline.addedTags',
    defaultMessage: `{user} has added {addedCount, plural,
      one {the tag}
      other {tags}
     } {added}`,
  },
  addedTagsChild: {
    id: 'modules.timeline.addedTagsChild',
    defaultMessage: `{user} has added {addedCount, plural,
      one {the tag}
      other {tags}
     } {added} to {child}`,
  },
  removedTags: {
    id: 'modules.timeline.removedTags',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the tag}
      other {tags}
     } {removed}`,
  },
  removedTagsChild: {
    id: 'modules.timeline.removedTagsChild',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the tag}
      other {tags}
     } {removed} to {child}`,
  },
  addedAndRemovedTags: {
    id: 'modules.timeline.addedAndRemovedTags',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the tag}
      other {tags}
     } {removed} and added {addedCount, plural,
      one {the tag}
      other {tags}
     } {added}`,
  },
  addedAndRemovedTagsChild: {
    id: 'modules.timeline.addedAndRemovedTagsChild',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the tag}
      other {tags}
     } {removed} and added {addedCount, plural,
      one {the tag}
      other {tags}
     } {added} to {child}`,
  },
  addedForwarders: {
    id: 'modules.timeline.addedForwarders',
    defaultMessage: `{user} has added {addedCount, plural,
      one {the forwarder}
      other {forwarders}
     } {added}`,
  },
  removedForwarders: {
    id: 'modules.timeline.removedForwarders',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the forwarder}
      other {forwarders}
     } {removed}`,
  },
  addedAndRemovedForwarders: {
    id: 'modules.timeline.addedAndRemovedForwarders',
    defaultMessage: `{user} has removed {removedCount, plural,
      one {the forwarder}
      other {forwarders}
     } {removed} and added {addedCount, plural,
      one {the forwarder}
      other {forwarders}
     } {added}`,
  },
  addedInCharges: {
    id: 'modules.timeline.addedInCharges',
    defaultMessage: `{user} has assigned {added}`,
  },
  addedInChargesChild: {
    id: 'modules.timeline.addedInChargesChild',
    defaultMessage: `{user} has assigned {added} to {child}`,
  },
  removedInCharges: {
    id: 'modules.timeline.removedInCharges',
    defaultMessage: `{user} has unassigned {removed}`,
  },
  removedInChargesChild: {
    id: 'modules.timeline.removedInChargesChild',
    defaultMessage: `{user} has unassigned {removed} to {child}`,
  },
  addedAndRemovedInCharges: {
    id: 'modules.timeline.addedAndRemovedInCharges',
    defaultMessage: `{user} has unassigned {removed} and assigned {added}`,
  },
  addedAndRemovedInChargesChild: {
    id: 'modules.timeline.addedAndRemovedInChargesChild',
    defaultMessage: `{user} has unassigned {removed} and assigned {added} to {child}`,
  },
  reviseDateChild: {
    id: 'modules.timeline.reviseDateChild',
    defaultMessage: `{user} has revised date of {child} to {date} because of {reviseType}`,
  },
  unReviseDateChild: {
    id: 'modules.timeline.unReviseDateChild',
    defaultMessage: `{user} has un-revised a {reviseType} date of {child}`,
  },
  addedDocument: {
    id: 'modules.timeline.addedDocument',
    defaultMessage: `{user} has added {document} to {documentType}.`,
  },
  removedDocument: {
    id: 'modules.timeline.removedDocument',
    defaultMessage: `{user} has removed {document} from {documentType}.`,
  },
  addedDocumentChild: {
    id: 'modules.timeline.addedDocumentChild',
    defaultMessage: `{user} has added {document} to {documentType} of {child}.`,
  },
  removedDocumentChild: {
    id: 'modules.timeline.removedDocumentChild',
    defaultMessage: `{user} has removed {document} from {documentType} of {child}.`,
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
  orderItem: {
    id: 'modules.timeline.orderItem',
    defaultMessage: 'item',
  },
  batch: {
    id: 'modules.timeline.batch',
    defaultMessage: 'batch',
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
  task: {
    id: 'modules.timeline.task',
    defaultMessage: 'task',
  },
  project: {
    id: 'modules.timeline.project',
    defaultMessage: 'project',
  },
  container: {
    id: 'modules.timeline.container',
    defaultMessage: 'container',
  },
  file: {
    id: 'modules.timeline.file',
    defaultMessage: 'file',
  },
  sendMessage: {
    id: 'modules.timeline.sendMessage',
    defaultMessage: 'sends a message',
  },
  newLine: {
    id: 'modules.timeline.newLine',
    defaultMessage: 'adds a new line',
  },
});
