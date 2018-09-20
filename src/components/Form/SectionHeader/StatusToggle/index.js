// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButtonStyle, StatusStyle } from './style';

type Props = {
  archived: boolean,
  openStatusDialog: Function,
  activateDialog: React.Node,
  archiveDialog: React.Node,
};

const StatusToggle = ({ archived, openStatusDialog, activateDialog, archiveDialog }: Props) => (
  <>
    {activateDialog}
    {archiveDialog}
    <div className={StatusStyle(archived)}>
      <Icon icon={archived ? 'ARCHIVE' : 'ACTIVE'} />
      {archived ? 'Archived' : 'Active'}
      <button
        type="button"
        className={ToggleButtonStyle(archived)}
        tabIndex={-1}
        onClick={openStatusDialog}
      >
        {archived ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
      </button>
    </div>
  </>
);

export default StatusToggle;
