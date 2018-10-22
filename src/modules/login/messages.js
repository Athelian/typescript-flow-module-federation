// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  error: {
    id: 'modules.Login.error',
    defaultMessage: 'Invalid username/password',
  },
  emailError: {
    id: 'modules.Login.validation.email',
    defaultMessage: 'Please enter a valid email address',
  },
  required: {
    id: 'modules.Login.validation.required',
    defaultMessage: 'Required',
  },
  email: {
    id: 'modules.Login.email',
    defaultMessage: 'EMAIL',
  },
  password: {
    id: 'modules.Login.password',
    defaultMessage: 'PASSWORD',
  },
  login: {
    id: 'modules.Login.login',
    defaultMessage: 'LOGIN',
  },
  loggingIn: {
    id: 'modules.Login.loggingIn',
    defaultMessage: 'Logging in ...',
  },
});
