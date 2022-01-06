// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { LoginTextStyle, ButtonStyle } from 'modules/login/components/TwoFactorForm/style';
import GridRow from 'components/GridRow';
import { BaseButton } from 'components/Buttons';

type Props = {
  onEnableClick: () => void,
  onCancelClick: () => void,
};

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorConfirmationForm = ({ onEnableClick, onCancelClick }: Props) => {
  return (
    <>
      <div className={LoginTextStyle}>
        <FormattedMessage
          id="modules.Login.2fa.description"
          defaultMessage="Two-factor authentication is an extra layer of security designed to ensure that you're the only person who can access your account, even if someone knows your password. After entering your email and password, you will be required to provide another piece of information."
        />
      </div>
      <div className={LoginTextStyle}>
        <FormattedMessage
          id="modules.Login.2fa.optional"
          defaultMessage="Two-Factor Authentication is optional. Would you like to enable two-factor authentication?"
        />
      </div>
      <GridRow>
        <BaseButton
          label="YES, ENABLE 2FA"
          backgroundColor="TEAL"
          hoverBackgroundColor="TEAL_DARK"
          className={ButtonStyle(false)}
          onClick={onEnableClick}
        />
        <BaseButton
          label="No, Continue to zenport"
          textColor="GRAY_DARK"
          backgroundColor="WHITE"
          hoverBackgroundColor="GRAY_DARK"
          hoverTextColor="WHITE"
          className={ButtonStyle(true)}
          onClick={onCancelClick}
        />
      </GridRow>
    </>
  );
};

export default TwoFactorConfirmationForm;
