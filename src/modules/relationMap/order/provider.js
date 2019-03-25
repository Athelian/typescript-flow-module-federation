// @flow
import * as React from 'react';
import type { UIState } from './store/type.js.flow';
import { uiInitState } from './store';

type ContextProps = {
  dispatch: (action: { type: string, payload: Object }) => void,
  state: UIState,
};

const ActionDispatch: React.Context<ContextProps> = React.createContext({
  dispatch: () => {},
  state: uiInitState,
});

export default ActionDispatch;

export const DispatchConsumer = ActionDispatch.Consumer;
export const DispatchProvider = ActionDispatch.Provider;
