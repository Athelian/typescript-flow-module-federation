// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  error: {
    id: 'containers.Login.error',
    defaultMessage: 'Invalid username/password',
  },
  emailError: {
    id: 'containers.Login.validation.email',
    defaultMessage: 'Please enter a valid email address',
  },
  required: {
    id: 'containers.Login.validation.required',
    defaultMessage: 'Required',
  },
  email: {
    id: 'containers.Login.email',
    defaultMessage: 'EMAIL',
  },
  password: {
    id: 'containers.Login.password',
    defaultMessage: 'PASSWORD',
  },
  login: {
    id: 'containers.Login.login',
    defaultMessage: 'LOGIN',
  },
  loggingIn: {
    id: 'containers.Login.loggingIn',
    defaultMessage: 'Logging in ...',
  },
});
