// @flow
import * as React from 'react';

type Context = {
  element: { current: HTMLElement | null },
};

export const FocusFallbackContext = React.createContext<Context>({
  element: { current: null },
});

export const useFocusFallback = (): Context => React.useContext(FocusFallbackContext);

type Props = {
  element: { current: HTMLElement | null },
  children: React.Node,
};

const FocusFallbackProvider = ({ element, children }: Props) => (
  <FocusFallbackContext.Provider value={{ element }}>{children}</FocusFallbackContext.Provider>
);

export default FocusFallbackProvider;
