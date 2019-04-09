// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import firebase from 'firebase';
import { toast } from 'react-toastify';
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
    // TODO: remove revision and try to use localStorage for tracking latest version which they already have on their PC
    const { revision, revisionKey } = this.props;

    const docRef = firebase.database().ref(`/${revisionKey}`);

    docRef.on('value', snapshot => {
      if (!snapshot.exists()) {
        return;
      }

      const currentRevision = snapshot.val();
      const currentVersion = window.localStorage.getItem('version');
      if (revision !== currentRevision && (!currentVersion || currentVersion !== currentRevision)) {
        toast(
          <button
            className={ToastButtonWrapperStyle}
            onClick={() => {
              window.localStorage.setItem('version', currentRevision);
              serviceWorker.unregister();
              window.location.reload();
            }}
            type="button"
          >
            <FormattedMessage
              id="components.deployNotifier.message"
              defaultMessage={`There has been an update.\nPlease refresh your browser.`}
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
