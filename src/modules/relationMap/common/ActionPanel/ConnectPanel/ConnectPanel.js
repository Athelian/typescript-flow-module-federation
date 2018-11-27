// @flow
import React from 'react';
import SelectedPanel from './SelectedPanel';
// import ConnectTypePanel from './ConnectTypePanel';
import ApplyPanel from './ApplyPanel';
import SuccessPanel from './SuccessPanel';

type Props = {
  connect: Object,
};
const ConnectPanel = ({ connect }: Props) => {
  const {
    state: { connectType, success },
    isSelectedItem,
    reset,
  } = connect;
  if (success) {
    return <SuccessPanel onClick={reset} />;
  }
  if (isSelectedItem()) {
    return <ApplyPanel />;
  }
  if (connectType) {
    return <SelectedPanel connectType={connectType} />;
  }
  return null;
};
export default ConnectPanel;
