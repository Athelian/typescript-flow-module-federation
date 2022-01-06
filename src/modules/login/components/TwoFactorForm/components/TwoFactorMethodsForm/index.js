// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import {
  LoginTextStyle,
  LoginDescriptionStyle,
  RadioWrapperStyle,
  ButtonStyle,
} from 'modules/login/components/TwoFactorForm/style';
import { BaseButton } from 'components/Buttons';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { RadioInput, Label } from 'components/Form';
import { colors } from 'styles/common';

const choices = [
  // TODO: add translations here
  // {
  //   value: 'twoFactorAuthenticationApp',
  //   label: <FormattedMessage id="modules.Login.2fa.authenticatorChoice" defaultMessage="TWO-FACTOR AUTHENTICATION APP" />,
  //   description: <FormattedMessage id="modules.Login.2fa.authenticatorDescription" defaultMessage="Use an application on your phone to get two-factor authentication codes. We recommend using cloud-based TOTP apps such as: Microsoft Authenticator, Twilio Authy, and Salesforce Authenticator." />
  // },
  // {
  //   value: 'textMessage',
  //   label: <FormattedMessage id="modules.Login.2fa.textChoice" defaultMessage="TEXT MESSAGE" />,
  //   description: <FormattedMessage id="modules.Login.2fa.textDescription" defaultMessage="Receive an text message containing a verification code. SMS cannot be delivered in all countries. Check that your country is supported before you select this option." />
  // },
  {
    value: 'email',
    label: <FormattedMessage id="modules.Login.2fa.emailChoice" defaultMessage="EMAIL" />,
    description: (
      <FormattedMessage
        id="modules.Login.2fa.emailDescription"
        defaultMessage="Receive an email at your Zenport login email address containing a verification code."
      />
    ),
  },
];

export type TwoFactorTypes = 'twoFactorAuthenticationApp' | 'textMessage' | 'email';

type Props = {
  onSaveClick: (value: TwoFactorTypes | null) => void,
  onCancelClick: () => void,
};

// https://www.figma.com/file/h8u12fy3ThKySrsdEs5ZVb/SSO-and-2FA?node-id=66%3A668
const TwoFactorMethodsForm = ({ onSaveClick, onCancelClick }: Props) => {
  const [selected, setSelected] = React.useState(null);

  return (
    <>
      <div className={LoginTextStyle}>
        <FormattedMessage
          id="modules.Login.2fa.selectAuthMethod"
          defaultMessage="Please select a method of authentication."
        />
      </div>
      <GridColumn>
        {choices.map(({ value, label, description }) => {
          return (
            <div key={value} className={RadioWrapperStyle}>
              <GridColumn gap="10px">
                <RadioInput selected={selected === value} onToggle={() => setSelected(value)}>
                  <Label color={colors.BLACK}>{label}</Label>
                </RadioInput>
                <div className={cx(LoginTextStyle, LoginDescriptionStyle)}>{description}</div>
              </GridColumn>
            </div>
          );
        })}
        <GridRow>
          <BaseButton
            label={
              <FormattedMessage
                id="modules.Login.2fa.selectAuthMethodContinue"
                defaultMessage="Continue"
              />
            }
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
            className={ButtonStyle(false)}
            disabled={!selected}
            onClick={() => onSaveClick(selected)}
          />
          <BaseButton
            label={
              <FormattedMessage
                id="modules.Login.2fa.selectAuthMethodCancel"
                defaultMessage="Cancel"
              />
            }
            textColor="GRAY_DARK"
            backgroundColor="WHITE"
            hoverBackgroundColor="GRAY_DARK"
            hoverTextColor="WHITE"
            className={ButtonStyle(true)}
            onClick={onCancelClick}
          />
        </GridRow>
      </GridColumn>
    </>
  );
};

export default TwoFactorMethodsForm;
