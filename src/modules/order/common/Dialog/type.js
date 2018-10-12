// @flow
type OptionalProps = {
  onConfirm: () => void,
};

export const defaultProps = {
  onConfirm: () => {},
};

export type OrderDialogProps = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  order: Object,
};

export default defaultProps;
