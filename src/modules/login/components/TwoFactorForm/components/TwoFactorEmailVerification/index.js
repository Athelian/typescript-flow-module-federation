// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridColumn from 'components/GridColumn';
import loginIcon from 'media/zenport-logo-blue.png';
import useUser from 'hooks/useUser';
import { LoginResendStyle, ButtonStyle } from 'modules/login/components/TwoFactorForm/style';
import { LoginBoxStyle, LoginLogoStyle } from 'modules/login/style';
import { BaseButton } from 'components/Buttons';
import { FieldItem, DefaultStyle, Display, Label, EmailInput, NumberInput } from 'components/Form';

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorEmailVerification = () => {
  const { user } = useUser();

  const [code, setCode] = React.useState(null);

  const handleResend = () => {
    console.log('resend clicked');
  };

  const handleContinue = () => {
    console.log('continue clicked');
  };

  return (
    <div className={LoginBoxStyle} gap="22px" style={{ width: 420 }}>
      <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
      <GridColumn style={{ textAlign: 'center' }}>
        <Display height="30px" color="black" align="center" style={{ fontSize: 28 }}>
          <FormattedMessage
            id="modules.Login.2fa.verifyIdentity"
            defaultMessage="Verify your identity"
          />
        </Display>
        <div color="BLACK">
          <FormattedMessage
            id="modules.Login.2fa.emailSentTo"
            defaultMessage="We've sent an email to:"
          />
        </div>
        <FieldItem
          input={
            <DefaultStyle forceHoverStyle width="280px">
              <EmailInput value={user?.email} align="left" readOnly />
            </DefaultStyle>
          }
        />
        <FieldItem
          vertical
          label={
            <Label>
              <FormattedMessage id="modules.Login.2fa.code" defaultMessage="Code" />
            </Label>
          }
          input={
            <DefaultStyle forceHoverStyle width="280px">
              <NumberInput
                placeholder={
                  <FormattedMessage
                    id="modules.Login.2fa.enterDigitCode"
                    defaultMessage="Enter the 6-digit code"
                  />
                }
                value={code}
                onChange={({ target }) => {
                  setCode(target.value);
                }}
                align="left"
              />
            </DefaultStyle>
          }
        />

        <BaseButton
          label="Continue"
          backgroundColor="TEAL"
          hoverBackgroundColor="TEAL_DARK"
          className={ButtonStyle(false)}
          style={{ width: '100%' }}
          disabled={code?.length < 6}
          onClick={handleContinue}
        />

        <div>
          <FormattedMessage
            id="modules.Login.2fa.notReceiveCode"
            defaultMessage="Didn't receive a code?"
          />
          <span
            className={LoginResendStyle}
            onClick={handleResend}
            onKeyDown={handleResend}
            role="button"
            tabIndex={0}
          >
            <FormattedMessage id="modules.Login.2fa.resend" defaultMessage="Resend" />
          </span>
        </div>
      </GridColumn>
    </div>
  );
};

export default TwoFactorEmailVerification;
