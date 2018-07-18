// @flow
import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import logger from 'utils/logger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt';
import messages from 'modules/login/messages';
import { LoginBoxStyle } from 'modules/login/style';
import TextInput from 'components/TextInput';
import { CustomButton } from 'components/NavButtons';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .required(<FormattedMessage {...messages.required} />)
    .email(<FormattedMessage {...messages.emailError} />),
  password: Yup.string().required(<FormattedMessage {...messages.required} />),
});

function LoginForm() {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={values => {
        logger.warn(values);
      }}
      render={({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
        <form onSubmit={handleSubmit}>
          <div className={LoginBoxStyle}>
            <TextInput
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              title={<FormattedMessage {...messages.email} />}
              error={touched.email && errors.email}
            />
            <TextInput
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              title={<FormattedMessage {...messages.password} />}
              error={touched.password && errors.password}
            />
            <CustomButton
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
