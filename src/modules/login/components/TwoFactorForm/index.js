// @flow
import * as React from 'react';
import { TwoFactorAuthentication, TwoFactorEmailVerification } from './components';

const TwoFactorForm = () => {
  const isRequired = false;
  const [methodSelected, setMethodSelected] = React.useState(null);

  if (methodSelected) {
    switch (methodSelected) {
      case 'email':
        return <TwoFactorEmailVerification />;
      default:
    }
  }

  return (
    <TwoFactorAuthentication
      isRequired={isRequired}
      onMethodSelected={method => {
        setMethodSelected(method);
      }}
      onOptionalCancel={() => {
        // TODO: go back to login form
      }}
    />
  );
};

export default TwoFactorForm;
