// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import firebase from 'firebase';
import * as serviceWorker from 'serviceWorker';

type Props = {
  revision: string,
  intl: IntlShape,
  revisionKey: string,
};

const DeployNotifier = ({ revision, revisionKey, intl }: Props) => {
  React.useEffect(() => {
    const docRef = firebase.database().ref(`/${revisionKey}`);

    docRef.on('value', snapshot => {
      if (!snapshot.exists()) {
        return;
      }
      const currentRevision = snapshot.val();

      if (revision !== currentRevision) {
        serviceWorker.unregister();
      }
    });
  }, [intl, intl.locale, revision, revisionKey]);

  return null;
};

export default injectIntl(DeployNotifier);
