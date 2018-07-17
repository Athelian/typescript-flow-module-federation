// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isDevEnvironment } from 'utils/env';
import {
  InternalErrorContainerStyle,
  InternalErrorTitleContainerStyle,
  InternalErrorGifStyle,
  InternalErrorH1Style,
  InternalErrorH3Style,
  InternalErrorLinkContainerStyle,
  InternalErrorLinkStyle,
  InternalErrorLogoStyle,
} from './style';
import loginIcon from './media/icon_white.png';
import messages from './messages';

export default function InternalError() {
  return (
    <div className={InternalErrorContainerStyle}>
      <div className={InternalErrorTitleContainerStyle}>
        <h1 className={InternalErrorH1Style}>
          {isDevEnvironment ? (
            <img
              className={InternalErrorGifStyle}
              src="https://media.giphy.com/media/5kzB8SARBWCmQ/giphy.gif"
              alt="lost"
            />
          ) : (
            '500'
          )}
        </h1>
        <h3 className={InternalErrorH3Style}>
          <FormattedMessage {...messages.message} />
        </h3>
      </div>
      <div className={InternalErrorLinkContainerStyle}>
        <Link to="/" className={InternalErrorLinkStyle}>
          <img src={loginIcon} className={InternalErrorLogoStyle} alt="Go home" />
          <span>
            <FormattedMessage {...messages.goHome} />
          </span>
        </Link>
      </div>
    </div>
  );
}
