// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { ResetButton } from 'components/Buttons';
import useBeforeUnload from 'hooks/useBeforeUnload';
import emitter from 'utils/emitter';

type Props = {|
  disabled: boolean,
  onClick: Function,
  label: React.Node,
|};

const defaultProps = {
  disabled: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.reset" defaultMessage="RESET" />,
};

const ResetFormButton = ({ disabled, onClick, label, ...rest }: Props): React.Node => {
  const intl = useIntl();
  useBeforeUnload(!disabled, () =>
    intl.formatMessage({
      id: 'components.form.confirmBeforeLeavePageMessage',
      defaultMessage: 'Are you sure you want to leave this page? Your changes will not be saved.',
    })
  );

  React.useEffect(() => {
    emitter.emit('DIRTY_RESET', !disabled);
    return () => {
      emitter.emit('DIRTY_RESET', false);
    };
  }, [disabled]);

  return <ResetButton label={label} disabled={disabled} onClick={onClick} {...rest} />;
};

ResetFormButton.defaultProps = defaultProps;

export default ResetFormButton;
