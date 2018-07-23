// @flow
import * as React from 'react';
import { Form, Field } from 'zenform';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt';
import messages from 'modules/login/messages';
import { LoginBoxStyle } from 'modules/login/style';
import TextInput from 'components/TextInput';
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
      render={({ errors, touched, onSubmit, isInvalid }) => (
        <form data-testid="loginForm" onSubmit={onSubmit}>
          <div className={LoginBoxStyle}>
            <Field
              name="email"
              render={({ input }) => (
                <TextInput
                  {...input}
                  data-testid="email"
                  type="email"
                  title={<FormattedMessage {...messages.email} />}
                  error={touched.email && errors.email}
                />
              )}
            />
            <Field
              name="password"
              render={({ input }) => (
                <TextInput
                  {...input}
                  data-testid="password"
                  type="password"
                  title={<FormattedMessage {...messages.password} />}
                  error={touched.password && errors.password}
                />
              )}
            />
            <CustomButton
              data-testid="submitButton"
              label={<FormattedMessage {...messages.login} />}
              icon={<FontAwesomeIcon icon={faSignInAlt} fixedWidth />}
              color="teal"
              type="submit"
              disabled={isInvalid}
              style={{ boxShadow: 'none', marginTop: '20px' }}
            />
          </div>
        </form>
      )}
    />
  );
}

export default LoginForm;
