// @flow
import * as React from 'react';
import type { UIState } from './store';
import { uiInitState } from './store';

type ContextProps = {
  dispatch: Function,
  state: UIState,
};

const ActionDispatch: React.Context<ContextProps> = React.createContext({
  dispatch: () => {},
  state: uiInitState,
});

export default ActionDispatch;

export const DispatchConsumer = ActionDispatch.Consumer;
export const DispatchProvider = ActionDispatch.Provider;
