// @flow
import React from 'react';
import SelectedPanel from './SelectedPanel';
// import ConnectTypePanel from './ConnectTypePanel';
import ApplyPanel from './ApplyPanel';
import SuccessPanel from './SuccessPanel';

type Props = {
  connect: Object,
  onCancel: Function,
  show: boolean,
};
const ConnectPanel = ({ connect, onCancel, show }: Props) => {
  const {
    state: { connectType, success },
    isSelectedItem,
  } = connect;
  if (success) {
    return <SuccessPanel onClick={onCancel} />;
  }
  if (!show) {
    return null;
  }
  if (isSelectedItem()) {
    return <ApplyPanel connectType={connectType} />;
  }
  if (connectType) {
    return <SelectedPanel connectType={connectType} />;
  }
  return null;
};
export default ConnectPanel;
