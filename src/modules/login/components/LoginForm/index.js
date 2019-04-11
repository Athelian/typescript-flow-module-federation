// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { Link } from '@reach/router';
import { FormContainer, FormField } from 'modules/form';
import LoginFormContainer from 'modules/login/container';
import messages from 'modules/login/messages';
import validator from 'modules/login/validator';
import GridColumn from 'components/GridColumn';
import { LoginBoxStyle, LoginButtonsStyle, ForgotPasswordStyle } from 'modules/login/style';
import {
  FieldItem,
  DefaultStyle,
  Label,
  FormTooltip,
  EmailInput,
  PasswordInput,
} from 'components/Form';
import { BaseButton } from 'components/Buttons';

type Props = {
  onLogin: Function,
};

function LoginForm({ onLogin }: Props) {
  return (
    <Subscribe to={[LoginFormContainer]}>
      {loginFormState => (
        <form data-testid="loginForm">
          <div className={LoginBoxStyle}>
            <GridColumn>
              <FormField
                name="email"
                initValue=""
                setFieldValue={loginFormState.setFieldValue}
                validator={validator}
                values={loginFormState.state}
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
                values={loginFormState.state}
                setFieldValue={loginFormState.setFieldValue}
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
                    disabled={!form.isReady(loginFormState.state, validator)}
                    type="submit"
                    onClick={() => onLogin(loginFormState.state)}
                  />
                )}
              </Subscribe>
              <Link to="/forgot-password" className={ForgotPasswordStyle}>
                <FormattedMessage
                  id="modules.login.forgotPassword"
                  defaultMessage="forgot password"
                />
              </Link>
            </div>
          </div>
        </form>
      )}
    </Subscribe>
  );
}

export default LoginForm;
