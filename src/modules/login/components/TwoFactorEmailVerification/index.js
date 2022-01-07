// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import GridColumn from 'components/GridColumn';
import loginIcon from 'media/zenport-logo-blue.png';
import { useMutation } from '@apollo/react-hooks';
import { LoginResendStyle, ButtonStyle } from 'modules/login/components/TwoFactorForm/style';
import {
  LoginBoxStyle,
  LoginLogoStyle,
  LoginErrorStyle,
  LoginSuccessStyle,
} from 'modules/login/style';
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

type MessageTypes = 'none' | 'verifySuccess' | 'verifyError' | 'resendSuccess' | 'resendError';

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorEmailVerification = ({ email, onCancel, onLoginSuccess }: Props) => {
  const intl = useIntl();

  const [message, setMessage] = React.useState<MessageTypes>('none');
  const [hasRequestedResend, setRequestResend] = React.useState(false);

  const [requestPassword, { loading: resendLoading }] = useMutation(
    requestOneTimePasswordMutation,
    {
      onCompleted: data => {
        if (!hasRequestedResend) {
          return;
        }

        if (data?.requestOneTimePassword?.violations) {
          setMessage('resendError');
        } else {
          setMessage('resendSuccess');
        }
      },
      onError: () => {
        if (!hasRequestedResend) {
          return;
        }

        setMessage('resendError');
      },
    }
  );

  const [verifyOneTimePassword, { loading: verifyLoading }] = useMutation(
    verifyOneTimePasswordMutation,
    {
      onCompleted: data => {
        if (data?.verifyOneTimePassword?.violations) {
          setMessage('verifyError');
        } else {
          onLoginSuccess();
        }
      },
      onError: () => {
        setMessage('verifyError');
      },
    }
  );

  const [code, setCode] = React.useState('');

  const handleResend = () => {
    if (resendLoading) {
      return;
    }

    setMessage('none');
    setRequestResend(true);

    requestPassword({
      variables: {
        type: 'Email',
      },
    });
  };

  const handleContinue = () => {
    setMessage('none');

    verifyOneTimePassword({
      variables: {
        code: code.toString(),
      },
    });
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
            disabled={verifyLoading}
            backgroundColor="WHITE"
            hoverBackgroundColor="GRAY_DARK"
            hoverTextColor="WHITE"
            className={ButtonStyle(true)}
            style={{ width: '100%' }}
            onClick={onCancel}
          />
        </GridColumn>

        <span>
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
        </span>
        {message === 'resendSuccess' && (
          <div className={LoginSuccessStyle}>
            <FormattedMessage id="modules.Login.2fa.resent" defaultMessage="Code has been resent" />
          </div>
        )}
        {message === 'resendError' && (
          <div className={LoginErrorStyle}>
            <FormattedMessage
              id="modules.Login.2fa.resentError"
              defaultMessage="An error occurred while sending the code"
            />
          </div>
        )}
        {message === 'verifyError' && (
          <div className={LoginErrorStyle}>
            <FormattedMessage
              id="modules.Login.2fa.incorrectCode"
              defaultMessage="Code is incorrect"
            />
          </div>
        )}
      </GridColumn>
    </div>
  );
};

export default TwoFactorEmailVerification;
