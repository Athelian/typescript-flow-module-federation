// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { Provider } from 'unstated';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { LanguageConsumer } from 'modules/language';
import { AuthenticationConsumer } from 'modules/authentication';
import LoadingIcon from 'components/LoadingIcon';
import LoginForm from './components/LoginForm';
import {
  LoginContainerStyle,
  LoginFormWrapperStyle,
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
  redirectUrl?: string,
};

const Login = ({ redirectUrl = '/' }: Props) => (
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
              if (!login.violations) {
                setAuthenticated(true);
              }
            }}
          >
            {(login, { loading, data, error }) => (
              <>
                {loading ? (
                  <LoadingIcon />
                ) : (
                  <Provider>
                    <div className={LoginLogoContainerStyle}>
                      <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
                      <img src={loginIconName} className={LoginLogoNameStyle} alt="brand logo" />
                    </div>
                    <div className={LoginFormWrapperStyle}>
                      <LoginForm
                        onLogin={variables => login({ variables: { input: variables } })}
                      />
                      {(error || (data && data.login && data.login.violations)) && (
                        <div id="errorMsg" className={LoginErrorStyle}>
                          <FormattedMessage {...messages.error} />{' '}
                        </div>
                      )}
                    </div>
                  </Provider>
                )}
              </>
            )}
          </Mutation>
          <footer className={LoginCopyrightStyle}>
            <span>
              © {new Date().getFullYear()} Zenport Inc.{' '}
              <LanguageConsumer>
                {({ changeLocale }) => <Icon icon="LANGUAGE" onClick={changeLocale} />}
              </LanguageConsumer>
            </span>
          </footer>
        </div>
      )
    }
  </AuthenticationConsumer>
);

export default Login;
