// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faLanguage from '@fortawesome/fontawesome-pro-regular/faLanguage';
import { LanguageConsumer } from 'modules/language';
import LoginForm from './components/LoginForm';
import {
  LoginContainerStyle,
  LoginLogoStyle,
  LoginLogoNameStyle,
  LoginCopyrightStyle,
  LoginLogoContainerStyle,
} from './style';

import loginIcon from './media/icon_white.png';
import loginIconName from './media/logo_white.png';

function Login() {
  return (
    <div className={LoginContainerStyle}>
      <div className={LoginLogoContainerStyle}>
        <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
        <img src={loginIconName} className={LoginLogoNameStyle} alt="brand logo" />
      </div>
      <LoginForm />
      <footer className={LoginCopyrightStyle}>
        <span>
          © {new Date().getFullYear()} Zenport Inc.{' '}
          <LanguageConsumer>
            {({ changeLocale }) => <FontAwesomeIcon icon={faLanguage} onClick={changeLocale} />}
          </LanguageConsumer>
        </span>
      </footer>
    </div>
  );
}

export default Login;
