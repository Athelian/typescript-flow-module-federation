// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { FormContainer, FormField } from 'modules/form';
import LoginFormContainer from 'modules/login/container';
import messages from 'modules/login/messages';
import validator from 'modules/login/validator';
import GridColumn from 'components/GridColumn';
import { LoginBoxStyle } from 'modules/login/style';
import {
  FieldItem,
  DefaultStyle,
  Label,
  Tooltip,
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
              >
                {({ name: fieldName, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage {...messages.email} />
                      </Label>
                    }
                    tooltip={<Tooltip isNew errorMessage={isTouched && errorMessage} />}
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
              >
                {({ name: fieldName, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage {...messages.password} />
                      </Label>
                    }
                    tooltip={<Tooltip isNew errorMessage={isTouched && errorMessage} />}
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
          </div>
        </form>
      )}
    </Subscribe>
  );
}

export default LoginForm;
