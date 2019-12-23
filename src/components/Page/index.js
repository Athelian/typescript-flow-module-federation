// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import emitter from 'utils/emitter';

type Props = {
  Component: React.ComponentType<any>,
};

export default function Page({ Component }: Props) {
  const intl = useIntl();
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const msg = intl.formatMessage({
        id: 'components.form.confirmBeforeLeavePageMessage',
        defaultMessage: 'Are you sure you want to leave this page? Your changes will not be saved.',
      });
      // eslint-disable-next-line no-param-reassign
      event.returnValue = msg;
      return msg;
    };

    emitter.addListener('VALIDATION_ERROR', isValid => {
      const hasError = !isValid;

      if (hasError) {
        window.addEventListener('beforeunload', handleBeforeUnload);
      } else {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  return <Component />;
}
