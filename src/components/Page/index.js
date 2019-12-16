// @flow
import * as React from 'react';
import emitter from 'utils/emitter';

type Props = {
  Component: React.ComponentType<any>,
};

export default function Page({ Component }: Props) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const msg = 'Are you sure you want to leave this page? Your changes will not be saved.';
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

  React.useEffect(() => {
    // check dirty state then show confirm dialog
    setReady(true);
    // do after
  }, []);

  if (!ready) return null;

  return <Component />;
}
