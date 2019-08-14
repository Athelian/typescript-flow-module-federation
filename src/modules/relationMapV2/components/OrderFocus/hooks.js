/* eslint-disable prefer-promise-reject-errors */
// @flow
import { useRef } from 'react';

type CancelPromise = {
  promise: Promise<any>,
  cancel: Function,
};

export const cancellablePromise = (promise: Promise<any>): CancelPromise => {
  let isCanceled = false;

  const wrappedPromise: Promise<any> = new Promise((resolve: Function, reject: Function) => {
    promise.then(
      value => {
        if (isCanceled) {
          reject({ isCanceled, value });
        } else {
          resolve(value);
        }
      },
      error => reject({ isCanceled, error })
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    },
  };
};

export const noop = () => {};

export const delay = (n: number): Promise<any> =>
  new Promise((resolve: Function) => setTimeout(resolve, n));

export const useCancellablePromises = () => {
  const pendingPromises = useRef([]);

  const appendPendingPromise = (promise: CancelPromise) => {
    if (pendingPromises && pendingPromises.current)
      pendingPromises.current = [...pendingPromises.current, promise];
  };

  const removePendingPromise = (promise: CancelPromise) => {
    pendingPromises.current = pendingPromises.current.filter(p => p !== promise);
  };

  const clearPendingPromises = () => {
    if (pendingPromises.current) {
      pendingPromises.current.forEach((p: CancelPromise) => p.cancel());
    }
  };

  const api = {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };

  return api;
};

// refer https://medium.com/trabe/prevent-click-events-on-double-click-with-react-with-and-without-hooks-6bf3697abc40
export const useClickPreventionOnDoubleClick = (onClick: Function, onDoubleClick: Function) => {
  const api = useCancellablePromises();

  const handleClick = () => {
    api.clearPendingPromises();
    const waitForClick = cancellablePromise(delay(250));
    api.appendPendingPromise(waitForClick);

    return waitForClick.promise
      .then(() => {
        api.removePendingPromise(waitForClick);
        onClick();
      })
      .catch(errorInfo => {
        api.removePendingPromise(waitForClick);
        if (!errorInfo.isCanceled) {
          throw errorInfo.error;
        }
      });
  };

  const handleDoubleClick = () => {
    api.clearPendingPromises();
    onDoubleClick();
  };

  return [handleClick, handleDoubleClick];
};
