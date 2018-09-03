// @flow
export type OrderDialogProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => void,

  totalBatches: number,
  unshippedBatches: number,
  shippedBatches: number,
};
