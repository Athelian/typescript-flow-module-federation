// @flow
import * as React from 'react';

export type ConfirmDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => Promise<any> | void,
  message: React.Node,
};

export type RemoveDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onRemove: () => Promise<any> | void,
  message: React.Node,
};
export type DeleteDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onRemove: () => Promise<any> | void,
  onRemoveAll: () => Promise<any> | void,
  message: React.Node,
};
