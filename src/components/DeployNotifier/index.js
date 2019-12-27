// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
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
import messages from './messages';

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
        toast.dismiss();
        // let close all toast then show new one
        setTimeout(() => {
          toast(
            <button
              className={ToastButtonWrapperStyle}
              onClick={() => {
                // refer apollo client doc https://www.apollographql.com/docs/react/recipes/authentication#login-logouts
                apolloClient.resetStore();
                // clear all cache before refresh
                if (window.localStorage) {
                  window.localStorage.clear();
                }
                window.location.reload();
              }}
              type="button"
            >
              {intl.formatMessage(messages.newVersionMessage)}
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
        }, 0);
      }
    });
  }, [intl, intl.locale, revision, revisionKey]);

  return null;
};

export default injectIntl(DeployNotifier);
