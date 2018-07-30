// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  PageNotFoundContainerStyle,
  PageNotFoundTitleContainerStyle,
  PageNotFoundLogoStyle,
  PageNotFoundTravoltaStyle,
  PageNotFoundH1Style,
  PageNotFoundH3Style,
  PageNotFoundButtonStyle,
  PageNotFoundLinkContainerStyle,
} from './style';
import loginIcon from './media/icon_white.png';
import messages from './messages';

type Props = {
  goBack?: Function,
};

const PageNotFound = ({ goBack }: Props) => (
  <div className={PageNotFoundContainerStyle}>
    <div className={PageNotFoundTitleContainerStyle}>
      <h1 className={PageNotFoundH1Style}>
        {process.env.NODE_ENV !== 'production' ? (
          <img
            className={PageNotFoundTravoltaStyle}
            src="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif"
            alt="lost"
          />
        ) : (
          '404'
        )}
      </h1>
      <h3 className={PageNotFoundH3Style}>
        <FormattedMessage {...messages.message} />
      </h3>
    </div>
    <div className={PageNotFoundLinkContainerStyle}>
      <button type="button" onClick={goBack} className={PageNotFoundButtonStyle}>
        <img src={loginIcon} className={PageNotFoundLogoStyle} alt="Go back" />
        <span>
          <FormattedMessage {...messages.goBack} />
        </span>
      </button>
    </div>
  </div>
);

PageNotFound.defaultProps = {
  goBack: () => window.history.back(),
};

export default PageNotFound;
