// @flow
import React from 'react';
import logger from 'utils/logger';
import SelectedPanel from './SelectedPanel';
import ConnectTypePanel from './ConnectTypePanel';
import ApplyPanel from './ApplyPanel';

type Props = {
  connect: Object,
};
const ConnectPanel = ({ connect }: Props) => {
  logger.warn('in connect panel', connect.step());
  switch (connect.step()) {
    default:
    case 1:
      return <ConnectTypePanel onClick={connect.setConnectType} />;
    case 2:
      return <SelectedPanel connect={connect} />;
    case 3:
      return <ApplyPanel />;
  }
};

export default ConnectPanel;
