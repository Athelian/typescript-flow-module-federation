// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import GridColumn from 'components/GridColumn';
import loginIcon from 'media/zenport-logo-blue.png';
import { useMutation } from '@apollo/react-hooks';
import { LoginResendStyle, ButtonStyle } from 'modules/login/components/TwoFactorForm/style';
import { LoginBoxStyle, LoginLogoStyle } from 'modules/login/style';
import {
  requestOneTimePasswordMutation,
  verifyOneTimePasswordMutation,
} from 'modules/login/mutation';
import { BaseButton } from 'components/Buttons';
import { FieldItem, DefaultStyle, Display, Label, EmailInput, NumberInput } from 'components/Form';

type Props = {
  email: string,
  onLoginSuccess: () => void,
  onCancel: () => void,
};

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorEmailVerification = ({ email, onCancel, onLoginSuccess }: Props) => {
  const intl = useIntl();
  const [requestPassword] = useMutation(requestOneTimePasswordMutation);
  const [verifyOneTimePassword] = useMutation(verifyOneTimePasswordMutation, {
    onCompleted: data => {
      console.log('data is ', data);
      onLoginSuccess();
    },
  });

  const [code, setCode] = React.useState('');

  const handleResend = () => {
    console.log('resend clicked');
    requestPassword({
      variables: {
        type: 'Email',
      },
    });
  };

  const handleContinue = () => {
    verifyOneTimePassword({
      variables: {
        code,
      },
    });
    console.log('continue clicked');
    // onLoginSuccess();
  };

  React.useEffect(() => {
    requestPassword({
      variables: {
        type: 'Email',
      },
    });
  }, [requestPassword]);

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
              <EmailInput value={email} align="left" readOnly />
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
                placeholder={intl.formatMessage({
                  id: 'modules.Login.2fa.enterDigitCode',
                  defaultMessage: 'Enter the 6-digit code',
                })}
                value={code}
                onChange={({ target }) => {
                  setCode(target.value);
                }}
                align="left"
              />
            </DefaultStyle>
          }
        />
        <GridColumn gap="10px" style={{ textAlign: 'center' }}>
          <BaseButton
            label={
              <FormattedMessage
                id="modules.Login.2fa.selectAuthMethodContinue"
                defaultMessage="Continue"
              />
            }
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
            className={ButtonStyle(false)}
            style={{ width: '100%' }}
            disabled={code?.length < 6}
            onClick={handleContinue}
          />

          <BaseButton
            label={
              <FormattedMessage
                id="modules.Login.2fa.selectAuthMethodCancel"
                defaultMessage="Cancel"
              />
            }
            textColor="GRAY_DARK"
            backgroundColor="WHITE"
            hoverBackgroundColor="GRAY_DARK"
            hoverTextColor="WHITE"
            className={ButtonStyle(true)}
            style={{ width: '100%' }}
            onClick={onCancel}
          />
        </GridColumn>

        <div>
          <FormattedMessage
            id="modules.Login.2fa.notReceiveCode"
            defaultMessage="Didn't receive a code?"
          />{' '}
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
