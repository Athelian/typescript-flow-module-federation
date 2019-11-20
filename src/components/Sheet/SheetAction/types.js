// @flow

export type ActionComponentProps = {
  entity: { id: string, type: string },
  item: Object,
  onDone: () => void,
};

export type DoAction = ({
  action: string,
  entity: { id: string, type: string },
  item: Object,
}) => void;
