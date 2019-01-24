// @flow
import * as React from 'react';
import firebase from 'firebase';
import logger from 'utils/logger';

type Props = {
  revision: string,
  environment: string,
};

type State = {
  outdated: boolean,
};

export default class DeployNotifier extends React.Component<Props, State> {
  state = {
    outdated: false,
  };

  componentDidMount() {
    const { revision, environment } = this.props;

    const docRef = firebase.database().ref(`/revision_${environment}`);

    docRef.on('value', snapshot => {
      if (!snapshot.exists()) {
        return;
      }

      const currentRevision = snapshot.val();
      if (revision !== currentRevision) {
        this.setState({ outdated: true });
      }
    });
  }

  render() {
    const { outdated } = this.state;
    if (outdated) {
      logger.warn('new version has been deployed, please refresh');
    }

    return null;
  }
}
