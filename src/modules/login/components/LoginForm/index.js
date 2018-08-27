// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt';
import messages from 'modules/login/messages';
import { LoginBoxStyle } from 'modules/login/style';
import { FieldItem, StyledTextInput, StyledPasswordInput, Form, Field } from 'components/Form';
import { CustomButton } from 'components/NavButtons';
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
            <Field
              name="email"
              render={({ input }) => (
                <FieldItem
                  data-testid="email"
                  label={<FormattedMessage {...messages.email} />}
                  input={hasError => (
                    <StyledTextInput
                      forceHoverStyle
                      hasError={hasError}
                      width="200px"
                      pureTextInputOptions={{
                        ...input,
                        align: 'left',
                      }}
                    />
                  )}
                  tooltipOptions={{
                    isNew: true,
                    tooltipBubbleOptions: {
                      errorMessage: touched.email && errors.email,
                    },
                  }}
                  vertical
                />
              )}
            />
            <Field
              name="password"
              render={({ input }) => (
                <FieldItem
                  data-testid="password"
                  label={<FormattedMessage {...messages.password} />}
                  input={hasError => (
                    <StyledPasswordInput
                      forceHoverStyle
                      hasError={hasError}
                      width="200px"
                      purePasswordInputOptions={{
                        ...input,
                        align: 'left',
                      }}
                    />
                  )}
                  tooltipOptions={{
                    isNew: true,
                    tooltipBubbleOptions: {
                      errorMessage: touched.password && errors.password,
                    },
                  }}
                  vertical
                />
              )}
            />
            <CustomButton
              data-testid="submitButton"
              label={<FormattedMessage {...messages.login} />}
              icon={<FontAwesomeIcon icon={faSignInAlt} fixedWidth />}
              color="teal"
              type="submit"
              disabled={isInvalid || !isDirty}
              style={{ boxShadow: 'none', marginTop: '20px' }}
            />
          </div>
        </form>
      )}
    />
  );
}

export default LoginForm;
