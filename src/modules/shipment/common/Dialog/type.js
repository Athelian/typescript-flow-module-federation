// @flow

type OptionalProps = {
  onConfirm: () => void,
};

export type ShipmentDialogProps = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  shipment: Object,
};

export const defaultProps = {
  onConfirm: () => {},
};

export default defaultProps;
