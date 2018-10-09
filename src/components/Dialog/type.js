// @flow
import * as React from 'react';

export type ConfirmDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => Promise<any> | void,
  width: number,
  message: React.Node,
};

export type RemoveDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onRemove: () => Promise<any> | void,
  width: number,
  message: React.Node,
};
