// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { ToggleButtonStyle, StatusStyle } from './style';

type OptionalProps = {
  readOnly: boolean,
  openStatusDialog: Function,
  activateDialog?: React.Node,
  archiveDialog?: React.Node,
};

type Props = OptionalProps & {
  archived: boolean,
};

const defaultProps = {
  readOnly: false,
  openStatusDialog: () => {},
};

const StatusToggle = ({
  readOnly,
  archived,
  openStatusDialog,
  activateDialog,
  archiveDialog,
}: Props) => (
  <>
    {!readOnly && activateDialog}
    {!readOnly && archiveDialog}
    <div className={StatusStyle(archived)}>
      <Icon icon={archived ? 'ARCHIVE' : 'ACTIVE'} />
      {archived ? (
        <FormattedMessage id="components.form.archived" defaultMessage="Archived" />
      ) : (
        <FormattedMessage id="components.form.active" defaultMessage="Active" />
      )}
      {!readOnly && (
        <button
          type="button"
          className={ToggleButtonStyle(archived)}
          tabIndex={-1}
          onClick={openStatusDialog}
          data-testid="archivedStatusToggle"
        >
          {archived ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
        </button>
      )}
    </div>
  </>
);

StatusToggle.defaultProps = defaultProps;

export default StatusToggle;
