// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import firebase from 'firebase';
import { toast } from 'react-toastify';
import apolloClient from 'apollo';
import Icon from 'components/Icon';
import * as serviceWorker from 'serviceWorker';
import {
  ToastWrapperStyle,
  ToastBodyStyle,
  ToastButtonWrapperStyle,
  ToastButtonIconStyle,
} from './style';

type Props = {
  revision: string,
  revisionKey: string,
};

export default class DeployNotifier extends React.Component<Props> {
  componentDidMount() {
    const { revision, revisionKey } = this.props;

    const docRef = firebase.database().ref(`/${revisionKey}`);

    docRef.on('value', snapshot => {
      if (!snapshot.exists()) {
        return;
      }

      const currentRevision = snapshot.val();
      if (revision !== currentRevision) {
        serviceWorker.unregister();
        toast(
          <button
            className={ToastButtonWrapperStyle}
            onClick={() => {
              window.localStorage.setItem('version', currentRevision);
              // refer apollo client doc https://www.apollographql.com/docs/react/recipes/authentication#login-logouts
              apolloClient.resetStore();
              window.location.reload();
            }}
            type="button"
          >
            <FormattedMessage
              id="components.deployNotifier.newVersionMessage"
              defaultMessage="An update is available. Please close all other Zenport tabs and click here."
            />
            <div className={ToastButtonIconStyle}>
              <Icon icon="RELOAD" />
            </div>
          </button>,
          {
            position: 'bottom-left',
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            closeButton: false,
            className: ToastWrapperStyle,
            bodyClassName: ToastBodyStyle,
          }
        );
      }
    });
  }

  render() {
    return null;
  }
}
