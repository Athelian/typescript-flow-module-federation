// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt';
import messages from 'modules/login/messages';
import { LoginBoxStyle } from 'modules/login/style';
import {
  FieldItem,
  StandardStyle,
  Label,
  Tooltip,
  PureEmailInput,
  PurePasswordInput,
  Form,
  Field,
} from 'components/Form';
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
                    <StandardStyle
                      isFocused={meta.isActive}
                      hasError={touched.email && errors.email}
                      forceHoverStyle
                      width="200px"
                    >
                      <PureEmailInput data-testid="email" align="left" name {...input} />
                    </StandardStyle>
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
                    <StandardStyle
                      isFocused={meta.isActive}
                      hasError={touched.password && errors.password}
                      forceHoverStyle
                      width="200px"
                    >
                      <PurePasswordInput data-testid="password" align="left" name {...input} />
                    </StandardStyle>
                  }
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
