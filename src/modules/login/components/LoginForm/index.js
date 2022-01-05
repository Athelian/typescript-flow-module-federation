// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Link } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';
import { FormContainer, FormField } from 'modules/form';
import messages from 'modules/login/messages';
import validator from 'modules/login/validator';
import { loginMutation } from 'modules/login/mutation';
import GridColumn from 'components/GridColumn';
import LoadingIcon from 'components/LoadingIcon';
import loginIcon from 'media/zenport-logo-blue.png';
import {
  LoginBoxStyle,
  LoginButtonsStyle,
  ForgotPasswordStyle,
  LoginLogoStyle,
  Separator,
  SsoStyle,
  LoginErrorStyle,
} from 'modules/login/style';
import {
  FieldItem,
  DefaultStyle,
  Label,
  FormTooltip,
  EmailInput,
  PasswordInput,
} from 'components/Form';
import { BaseButton } from 'components/Buttons';
import SsoButton from './ssoButton';

type Props = {
  onLoginSuccess: Function,
};

function LoginForm({ onLoginSuccess }: Props) {
  const [login, { loading, data, error }] = useMutation(loginMutation, {
    onCompleted: result => {
      if (result && result.login && !result.login.violations) {
        onLoginSuccess();
      }
    },
  });

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  if (loading) {
    return <LoadingIcon />;
  }

  if (error || (data && data.login && data.login.violations)) {
    return (
      <div id="errorMsg" className={LoginErrorStyle}>
        <FormattedMessage {...messages.error} />{' '}
      </div>
    );
  }

  return (
    <Provider>
      <form data-testid="loginForm" className={LoginBoxStyle}>
        <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
        <GridColumn>
          <FormField
            name="email"
            initValue=""
            setFieldValue={(field, value) => setEmail(value)}
            validator={validator}
            values={{ email, password }}
            validationOnChange
            saveOnChange
          >
            {({ name: fieldName, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
              <FieldItem
                vertical
                label={
                  <Label>
                    <FormattedMessage {...messages.email} />
                  </Label>
                }
                tooltip={<FormTooltip isNew errorMessage={isTouched && errorMessage} />}
                input={
                  <DefaultStyle
                    isFocused={isFocused}
                    hasError={isTouched && errorMessage}
                    forceHoverStyle
                    width="200px"
                  >
                    <EmailInput
                      data-testid="email"
                      align="left"
                      name={fieldName}
                      {...inputHandlers}
                    />
                  </DefaultStyle>
                }
              />
            )}
          </FormField>
          <FormField
            name="password"
            initValue=""
            validator={validator}
            values={{ email, password }}
            setFieldValue={(field, value) => setPassword(value)}
            validationOnChange
            saveOnChange
          >
            {({ name: fieldName, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
              <FieldItem
                vertical
                label={
                  <Label>
                    <FormattedMessage {...messages.password} />
                  </Label>
                }
                tooltip={<FormTooltip isNew errorMessage={isTouched && errorMessage} />}
                input={
                  <DefaultStyle
                    isFocused={isFocused}
                    hasError={isTouched && errorMessage}
                    forceHoverStyle
                    width="200px"
                  >
                    <PasswordInput
                      data-testid="password"
                      align="left"
                      name={fieldName}
                      {...inputHandlers}
                    />
                  </DefaultStyle>
                }
              />
            )}
          </FormField>
        </GridColumn>
        <div className={LoginButtonsStyle}>
          <Subscribe to={[FormContainer]}>
            {form => (
              <BaseButton
                data-testid="submitButton"
                icon="LOGIN"
                label={<FormattedMessage {...messages.login} />}
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                disabled={!form.isReady({ email, password }, validator)}
                type="submit"
                onClick={() =>
                  login({
                    variables: { input: { email, password } },
                  })
                }
              />
            )}
          </Subscribe>
          {/* $FlowFixMe Flow typed is not updated yet */}
          <Link to="/reset-password" className={ForgotPasswordStyle}>
            <FormattedMessage id="modules.login.resetPassword" defaultMessage="Reset password" />
          </Link>
        </div>
        <div className={SsoStyle}>
          <div className={Separator}>OR</div>
          <SsoButton type="google" />
        </div>
      </form>
    </Provider>
  );
}

export default LoginForm;
