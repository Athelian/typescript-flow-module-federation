// @flow
type OptionalProps = {
  onConfirm: () => void,
};

export const defaultProps = {
  onConfirm: () => {},
};

export type ProductDialogProps = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  product: Object,
};

export default defaultProps;
