// @flow
import * as React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faLanguage from '@fortawesome/fontawesome-pro-regular/faLanguage';
import { LanguageConsumer } from 'modules/language';
import { setAuthToken, isAuthenticated } from 'utils/auth';
import LoadingIcon from 'components/LoadingIcon';
import LoginForm from './components/LoginForm';
import {
  LoginContainerStyle,
  LoginLogoStyle,
  LoginErrorStyle,
  LoginLogoNameStyle,
  LoginCopyrightStyle,
  LoginLogoContainerStyle,
} from './style';
import messages from './messages';

import loginIcon from './media/icon_white.png';
import loginIconName from './media/logo_white.png';

const LOGIN_MUTAION = gql`
  mutation login($email: Email!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

type Props = {
  location: {
    state?: {
      from?: {
        pathname: string,
        search: string,
      },
    },
  },
  history: {
    push: Function,
  },
};

const saveTokenAndRedirect = ({ token }, redirectUrl) => {
  setAuthToken(token);
  redirectUrl();
};

function Login({ location, history }: Props) {
  const redirectUrl =
    location.state && location.state.from
      ? `${location.state.from.pathname}${location.state.from.search}`
      : '/';
  if (isAuthenticated()) {
    history.push(redirectUrl);
  }
  return !isAuthenticated() ? (
    <div className={LoginContainerStyle}>
      <div className={LoginLogoContainerStyle}>
        <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
        <img src={loginIconName} className={LoginLogoNameStyle} alt="brand logo" />
      </div>
      <Mutation mutation={LOGIN_MUTAION}>
        {(login, { loading, called, error, data }) => (
          <React.Fragment>
            {loading && <LoadingIcon />}
            {called && data && saveTokenAndRedirect(data.login, () => history.push(redirectUrl))}
            {error && (
              <div id="errorMsg" classNam={LoginErrorStyle}>
                <FormattedMessage {...messages.error} />{' '}
              </div>
            )}
            <LoginForm onLogin={variables => login({ variables })} />{' '}
          </React.Fragment>
        )}
      </Mutation>
      <footer className={LoginCopyrightStyle}>
        <span>
          © {new Date().getFullYear()} Zenport Inc.{' '}
          <LanguageConsumer>
            {({ changeLocale }) => <FontAwesomeIcon icon={faLanguage} onClick={changeLocale} />}
          </LanguageConsumer>
        </span>
      </footer>
    </div>
  ) : (
    <LoadingIcon />
  );
}

export default Login;
