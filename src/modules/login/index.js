// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faLanguage from '@fortawesome/fontawesome-pro-regular/faLanguage';
import { LanguageConsumer } from 'modules/language';
import { AuthenticationConsumer } from 'modules/authentication';
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
import { loginMutation } from './mutation';
import loginIcon from './media/icon_white.png';
import loginIconName from './media/logo_white.png';

type Props = {
  redirectUrl: string,
};

const Login = ({ redirectUrl }: Props) => (
  <AuthenticationConsumer>
    {({ authenticated, setAuthenticated }) =>
      authenticated ? (
        <Location>
          {({ location }) => <Redirect from={location.pathname} to={redirectUrl} noThrow />}
        </Location>
      ) : (
        <div className={LoginContainerStyle}>
          <Mutation
            mutation={loginMutation}
            onCompleted={({ login }) => {
              if (login.violations === null) {
                setAuthenticated(true);
              }
            }}
          >
            {(login, { loading, error }) => (
              <React.Fragment>
                {error && (
                  <div id="errorMsg" className={LoginErrorStyle}>
                    <FormattedMessage {...messages.error} />{' '}
                  </div>
                )}
                {loading ? (
                  <LoadingIcon />
                ) : (
                  <React.Fragment>
                    <div className={LoginLogoContainerStyle}>
                      <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
                      <img src={loginIconName} className={LoginLogoNameStyle} alt="brand logo" />
                    </div>
                    <LoginForm onLogin={variables => login({ variables: { input: variables } })} />
                  </React.Fragment>
                )}
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
      )
    }
  </AuthenticationConsumer>
);

export default Login;
