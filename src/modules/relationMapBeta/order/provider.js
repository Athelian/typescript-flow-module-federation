// @flow
import * as React from 'react';
import type { UIState } from './store';

type ContextProps = ?{
  dispatch: Function,
  state: UIState,
};

const ActionDispatch: React.Context<ContextProps> = React.createContext(null);

export default ActionDispatch;

export const DispatchConsumer = ActionDispatch.Consumer;
export const DispatchProvider = ActionDispatch.Provider;
