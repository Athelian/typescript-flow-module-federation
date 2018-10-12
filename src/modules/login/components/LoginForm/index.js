// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/login/messages';
import GridColumn from 'components/GridColumn';
import { LoginBoxStyle } from 'modules/login/style';
import {
  FieldItem,
  DefaultStyle,
  Label,
  Tooltip,
  EmailInput,
  PasswordInput,
  Form,
  Field,
} from 'components/Form';
import { BaseButton } from 'components/Buttons';
import yupToFormErrors from 'utils/yupToFormErrors';

type Props = {
  onLogin: Function,
};

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required(<FormattedMessage {...messages.required} />)
    .email(<FormattedMessage {...messages.emailError} />),
  password: Yup.string().required(<FormattedMessage {...messages.required} />),
});

const onValidate = (values: Object) =>
  new Promise((resolve, reject) => {
    LoginSchema.validate(values, { abortEarly: false })
      .then(() => resolve({}))
      .catch(error => reject(yupToFormErrors(error)));
  });

function LoginForm({ onLogin }: Props) {
  return (
    <Form
      initialValues={{
        email: '',
        password: '',
      }}
      validateOnChange
      validations={onValidate}
      onSubmit={onLogin}
      render={({ errors, touched, handleSubmit, isInvalid, isDirty }) => (
        <form data-testid="loginForm" onSubmit={handleSubmit}>
          <div className={LoginBoxStyle}>
            <GridColumn>
              <Field
                name="email"
                render={({ input, meta }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage {...messages.email} />
                      </Label>
                    }
                    tooltip={<Tooltip isNew errorMessage={touched.email && errors.email} />}
                    input={
                      <DefaultStyle
                        isFocused={meta.isActive}
                        hasError={touched.email && errors.email}
                        forceHoverStyle
                        width="200px"
                      >
                        <EmailInput data-testid="email" align="left" name {...input} />
                      </DefaultStyle>
                    }
                  />
                )}
              />
              <Field
                name="password"
                render={({ input, meta }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage {...messages.password} />
                      </Label>
                    }
                    tooltip={<Tooltip isNew errorMessage={touched.password && errors.password} />}
                    input={
                      <DefaultStyle
                        isFocused={meta.isActive}
                        hasError={touched.password && errors.password}
                        forceHoverStyle
                        width="200px"
                      >
                        <PasswordInput data-testid="password" align="left" name {...input} />
                      </DefaultStyle>
                    }
                  />
                )}
              />
            </GridColumn>
            <BaseButton
              data-testid="submitButton"
              icon="LOGIN"
              label={<FormattedMessage {...messages.login} />}
              backgroundColor="TEAL"
              hoverBackgroundColor="TEAL_DARK"
              disabled={isInvalid || !isDirty}
              type="submit"
            />
          </div>
        </form>
      )}
    />
  );
}

export default LoginForm;
