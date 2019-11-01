// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { Link } from '@reach/router';
import { FormContainer, FormField } from 'modules/form';
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
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <form data-testid="loginForm">
      <div className={LoginBoxStyle}>
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
                onClick={() => onLogin({ email, password })}
              />
            )}
          </Subscribe>
          {/* $FlowFixMe Flow typed is not updated yet */}
          <Link to="/forgot-password" className={ForgotPasswordStyle}>
            <FormattedMessage id="modules.login.forgotPassword" defaultMessage="forgot password" />
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
