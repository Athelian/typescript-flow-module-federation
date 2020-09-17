// @flow
type OptionalProps = {
  onConfirm: () => void,
};

export const defaultProps = {
  onConfirm: () => {},
};

export type WarehouseDialogProps = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  warehouse: Object,
};

export default defaultProps;
