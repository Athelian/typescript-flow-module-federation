// @flow
import * as React from 'react';

export type ConfirmDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => void,
  width: number,
  message: React.Node,
};
