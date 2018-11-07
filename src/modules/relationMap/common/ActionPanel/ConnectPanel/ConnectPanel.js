// @flow
import React from 'react';
import SelectedPanel from './SelectedPanel';
import ConnectTypePanel from './ConnectTypePanel';
import ApplyPanel from './ApplyPanel';
import SuccessPanel from './SuccessPanel';

type Props = {
  connect: Object,
  refetch: Function,
  targetedItem: Object,
};
const ConnectPanel = ({ connect, refetch, targetedItem }: Props) => {
  const {
    state: { currentStep },
  } = connect;
  switch (currentStep) {
    default:
    case 1:
      return <ConnectTypePanel onClick={connect.setConnectType} targetedItem={targetedItem} />;
    case 2:
      return <SelectedPanel connect={connect} refetch={refetch} />;
    case 3:
      return <ApplyPanel />;
    case 4:
      return <SuccessPanel />;
  }
};

export default ConnectPanel;
