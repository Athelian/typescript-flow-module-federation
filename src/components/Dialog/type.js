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

export type FormDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onSave: () => Promise<any> | void,
  className?: string,
  width?: string,
  children: React.Node,
};

export type DeleteDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onRemove: () => Promise<any> | void,
  onRemoveAll: () => Promise<any> | void,
  message: React.Node,
};

export type CompleteDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onSkip: () => void,
  onComplete: () => void,
  onUnChange: () => void,
  message: React.Node,
};
