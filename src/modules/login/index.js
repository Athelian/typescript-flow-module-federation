// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import GradientContainer from 'components/GradientContainer';
import { AuthenticatedConsumer } from 'contexts/Viewer';
import LoginForm from './components/LoginForm';
import { LoginContainerStyle, LoginFormWrapperStyle, LoginCopyrightStyle } from './style';

type Props = {
  redirectUrl?: string,
};

const Login = ({ redirectUrl = '/' }: Props) => {
  return (
    <AuthenticatedConsumer>
      {({ authenticated, setAuthenticated }) =>
        authenticated ? (
          <Location>
            {({ location }) => <Redirect from={location.pathname} to={redirectUrl} noThrow />}
          </Location>
        ) : (
          <GradientContainer className={LoginContainerStyle}>
            <div className={LoginFormWrapperStyle}>
              <LoginForm
                // onLogin={variables => login({ variables: { input: variables } })}
                onLoginSuccess={() => {
                  console.log('i am syccess');
                  // if (window.localStorage) {
                  //   window.localStorage.clear();
                  // }
                  if (false) {
                    setAuthenticated(true);
                  }
                }}
              />
            </div>
            <footer className={LoginCopyrightStyle}>
              <span>© {new Date().getFullYear()} Zenport Inc.</span>
            </footer>
          </GradientContainer>
        )
      }
    </AuthenticatedConsumer>
  );
};

export default Login;
