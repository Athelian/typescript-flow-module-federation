// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TwoFactorBoxStyle, LoginTitleStyle } from 'modules/login/components/TwoFactorForm/style';
import TwoFactorMethodsForm from '../TwoFactorMethodsForm';
import type { TwoFactorTypes } from '../TwoFactorMethodsForm';
import TwoFactorConfirmationForm from '../TwoFactorConfirmationForm';

type Props = {
  isRequired: boolean,
  onMethodSelected: (methodType: TwoFactorTypes) => void,
  onOptionalCancel: () => void,
};

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorAuthentication = ({ isRequired, onMethodSelected, onOptionalCancel }: Props) => {
  const [hasConfirmed, setConfirmed] = React.useState(isRequired);

  return (
    <div className={TwoFactorBoxStyle} style={{ width: 600 }}>
      <div className={LoginTitleStyle}>
        <FormattedMessage
          id="modules.Login.2fa.header"
          defaultMessage="TWO FACTOR AUTHENTICATION"
        />
      </div>

      {!isRequired && !hasConfirmed && (
        <TwoFactorConfirmationForm
          onEnableClick={() => setConfirmed(true)}
          onCancelClick={onOptionalCancel}
        />
      )}

      {hasConfirmed && (
        <TwoFactorMethodsForm
          onSaveClick={(value: TwoFactorTypes) => {
            onMethodSelected(value);
          }}
          onCancelClick={onOptionalCancel}
        />
      )}
    </div>
  );
};

export default TwoFactorAuthentication;
