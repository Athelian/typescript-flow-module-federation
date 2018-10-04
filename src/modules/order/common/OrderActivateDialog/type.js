// @flow
export type OrderDialogProps = {
  isOpen: boolean,
  orderId: string,
  onRequestClose: () => void,
  totalBatches: number,
  unshippedBatches: number,
  shippedBatches: number,
};
