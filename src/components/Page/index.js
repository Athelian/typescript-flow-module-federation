// @flow
import * as React from 'react';
import useBeforeUnload from 'hooks/useBeforeUnload';
import emitter from 'utils/emitter';

type Props = {
  Component: React.ComponentType<any>,
};

export default function Page({ Component }: Props) {
  const [ready, setReady] = React.useState(false);
  const ref = React.useRef(true);

  React.useEffect(() => {
    emitter.addListener('VALIDATION_ERROR', hasError => {
      ref.current = hasError;
    });

    return () => {
      emitter.removeAllListeners('VALIDATION_ERROR');
    };
  }, []);

  useBeforeUnload(
    !ref.current,
    () => 'Are you sure you want to leave this page? Your changes will not be saved.'
  );

  React.useEffect(() => {
    // check dirty state then show confirm dialog
    setReady(true);
    // do after
  }, []);

  if (!ready) return null;

  return <Component />;
}
