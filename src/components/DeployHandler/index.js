// @flow
import * as React from 'react';
import firebase from 'firebase';
import * as serviceWorker from 'serviceWorker';

type Props = {
  revision: string,
  revisionKey: string,
};

const DeployHandler = ({ revision, revisionKey }: Props) => {
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
  }, [revision, revisionKey]);

  return null;
};

export default DeployHandler;
