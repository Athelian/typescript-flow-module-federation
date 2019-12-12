/* eslint-disable no-param-reassign */
// @flow
import { useEffect, useRef } from 'react';

type Handler = BeforeUnloadEvent => string | void;

// Borrow from https://www.npmjs.com/package/react-beforeunload
const useBeforeUnload = (isEnable: boolean = true, handler: Handler = () => '') => {
  if (process.env.NODE_ENV !== 'production' && typeof handler !== 'function') {
    throw new TypeError(`Expected "handler" to be a function, not ${typeof handler}.`);
  }

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      let returnValue;

      if (typeof handlerRef.current === 'function') {
        returnValue = handlerRef.current(event);
      }

      if (event.defaultPrevented) {
        event.returnValue = '';
        returnValue = '';
      }

      if (typeof returnValue === 'string') {
        event.returnValue = returnValue;
      }

      return returnValue;
    };

    if (isEnable) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEnable]);
};

export default useBeforeUnload;
