// @flow
import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt';
import messages from 'modules/login/messages';
import { LoginBoxStyle } from 'modules/login/style';
import TextInput from 'components/TextInput';
import { CustomButton } from 'components/NavButtons';

type Props = {
  onLogin: Function,
};

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required(<FormattedMessage {...messages.required} />)
    .email(<FormattedMessage {...messages.emailError} />),
  password: Yup.string().required(<FormattedMessage {...messages.required} />),
});

function LoginForm({ onLogin }: Props) {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={onLogin}
      render={({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
        <form data-testid="loginForm" onSubmit={handleSubmit}>
          <div className={LoginBoxStyle}>
            <TextInput
              data-testid="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              title={<FormattedMessage {...messages.email} />}
              error={touched.email && errors.email}
            />
            <TextInput
              data-testid="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              title={<FormattedMessage {...messages.password} />}
              error={touched.password && errors.password}
            />
            <CustomButton
              data-testid="submitButton"
              label={<FormattedMessage {...messages.login} />}
              icon={<FontAwesomeIcon icon={faSignInAlt} fixedWidth />}
              color="teal"
              type="submit"
              disabled={!isValid}
              style={{ boxShadow: 'none', marginTop: '20px' }}
            />
          </div>
        </form>
      )}
    />
  );
}

export default LoginForm;
