// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridColumn from 'components/GridColumn';
import loginIcon from 'media/zenport-logo-blue.png';
import {
  ButtonStyle,
  RecoverCodeStyle,
  TwoFactorBoxStyle,
} from 'modules/login/components/TwoFactorForm/style';
import { LoginLogoStyle } from 'modules/login/style';
import { BaseButton } from 'components/Buttons';
import { Display } from 'components/Form';

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorAlmostThere = () => {
  const code = 'ET3USCWS8KBGW9XMWLGLL9N7';
  const handleCopyClick = () => {};

  return (
    <div className={TwoFactorBoxStyle} gap="22px" style={{ width: 420 }}>
      <GridColumn centered style={{ textAlign: 'center', width: '100%' }}>
        <img src={loginIcon} className={LoginLogoStyle} alt="brand logo" />
        <Display height="30px" color="black" align="center" style={{ fontSize: 28 }}>
          <FormattedMessage id="modules.Login.2fa.almostThere" defaultMessage="Almost There!" />
        </Display>
        <div>
          <FormattedMessage
            id="modules.Login.2fa.copyRecoverCode"
            defaultMessage="Copy this recover code and keep it somewhere safe. You'll need it if you ever need to log in without your device."
          />
        </div>

        <div className={RecoverCodeStyle}>{code}</div>
        <BaseButton
          label="COPY CODE"
          textColor="GRAY_DARK"
          backgroundColor="WHITE"
          hoverBackgroundColor="GRAY_DARK"
          hoverTextColor="WHITE"
          className={ButtonStyle(true)}
          style={{ width: '100%' }}
          onClick={handleCopyClick}
        />
        <BaseButton
          label="Continue"
          backgroundColor="TEAL"
          hoverBackgroundColor="TEAL_DARK"
          className={ButtonStyle(false)}
          style={{ width: '100%' }}
        />
      </GridColumn>
    </div>
  );
};

export default TwoFactorAlmostThere;
