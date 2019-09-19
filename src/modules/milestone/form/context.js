// @flow
import React from 'react';

type ContextProps = {
  inTemplate: boolean,
};

export const FormContext = React.createContext<ContextProps>({
  inTemplate: false,
});

export default FormContext;
