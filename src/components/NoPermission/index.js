// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  NoPermissionContainerStyle,
  NoPermissionTitleContainerStyle,
  NoPermissionLogoStyle,
  NoPermissionTravoltaStyle,
  NoPermissionH1Style,
  NoPermissionH3Style,
  NoPermissionButtonStyle,
  NoPermissionLinkContainerStyle,
} from './style';
import loginIcon from './media/icon_white.png';
import messages from './messages';

type Props = {
  goBack?: Function,
};

const NoPermission = ({ goBack }: Props) => (
  <div className={NoPermissionContainerStyle}>
    <div className={NoPermissionTitleContainerStyle}>
      <h1 className={NoPermissionH1Style}>
        {process.env.NODE_ENV !== 'production' ? (
          <img
            className={NoPermissionTravoltaStyle}
            src="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif"
            alt="lost"
          />
        ) : (
          '403'
        )}
      </h1>
      <h3 className={NoPermissionH3Style}>
        <FormattedMessage {...messages.message} />
      </h3>
    </div>
    <div className={NoPermissionLinkContainerStyle}>
      <button type="button" onClick={goBack} className={NoPermissionButtonStyle}>
        <img src={loginIcon} className={NoPermissionLogoStyle} alt="Go back" />
        <span>
          <FormattedMessage {...messages.goBack} />
        </span>
      </button>
    </div>
  </div>
);

NoPermission.defaultProps = {
  goBack: () => window.history.back(),
};

export default NoPermission;
