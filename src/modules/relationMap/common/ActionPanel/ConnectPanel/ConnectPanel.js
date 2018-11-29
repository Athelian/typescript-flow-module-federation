// @flow
import React from 'react';
import SelectedPanel from './SelectedPanel';
// import ConnectTypePanel from './ConnectTypePanel';
import ApplyPanel from './ApplyPanel';
import SuccessPanel from './SuccessPanel';

type Props = {
  connect: Object,
  filter: Object,
};
const ConnectPanel = ({ connect, filter }: Props) => {
  const {
    state: { connectType, success },
    isSelectedItem,
    reset,
  } = connect;
  if (success) {
    return <SuccessPanel onClick={reset} />;
  }
  if (isSelectedItem()) {
    return <ApplyPanel connectType={connectType} filter={filter} />;
  }
  if (connectType) {
    return <SelectedPanel connectType={connectType} filter={filter} />;
  }
  return null;
};
export default ConnectPanel;
