// @flow
type OptionalProps = {
  onConfirm: () => void,
};

export const defaultProps = {
  onConfirm: () => {},
};

export type ProjectDialogProps = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  project: Object,
};

export default defaultProps;
