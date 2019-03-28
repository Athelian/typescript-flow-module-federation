// @flow
import * as React from 'react';

export type SlideViewContextProps = {
  domElement: null | HTMLElement,
  width: null | number,
  minWidth: null | number,
};

const SlideViewContext: React.Context<SlideViewContextProps> = React.createContext({
  domElement: null,
  width: null,
  minWidth: null,
});

export default SlideViewContext;
