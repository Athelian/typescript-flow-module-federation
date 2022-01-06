// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import GradientContainer from 'components/GradientContainer';
import { useViewer } from 'contexts/Viewer';
import LoginForm from './components/LoginForm';
import { LoginContainerStyle, LoginFormWrapperStyle, LoginCopyrightStyle } from './style';

type Props = {
  redirectUrl?: string,
};

const Login = ({ redirectUrl = '/' }: Props) => {
  const { authenticated, setAuthenticated } = useViewer();

  if (authenticated) {
    return (
      <Location>
        {({ location }) => <Redirect from={location.pathname} to={redirectUrl} noThrow />}
      </Location>
    );
  }

  return (
    <GradientContainer className={LoginContainerStyle}>
      <div className={LoginFormWrapperStyle}>
        <LoginForm
          onLoginSuccess={() => {
            if (window.localStorage) {
              window.localStorage.clear();
            }

            setAuthenticated(true);
          }}
        />
      </div>
      <footer className={LoginCopyrightStyle}>
        <span>© {new Date().getFullYear()} Zenport Inc.</span>
      </footer>
    </GradientContainer>
  );
};

export default Login;
