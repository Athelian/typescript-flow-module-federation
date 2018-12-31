// @flow
import * as React from 'react';

type ContextProps = ?{
  dispatch: Function,
};

const ActionDispatch: React.Context<ContextProps> = React.createContext(null);

export default ActionDispatch;

export const DispatchConsumer = ActionDispatch.Consumer;
export const DispatchProvider = ActionDispatch.Provider;
