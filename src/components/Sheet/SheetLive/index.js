// @flow
import * as React from 'react';
import { uuid } from 'utils/id';

const SheetLiveIDContext = React.createContext<string>('');

const useSheetLiveID = () => React.useContext(SheetLiveIDContext);

type Props = {
  children: React.Node,
};

const SheetLiveID = ({ children }: Props) => {
  const [id] = React.useState(uuid());

  return <SheetLiveIDContext.Provider value={id}>{children}</SheetLiveIDContext.Provider>;
};

export { SheetLiveID, useSheetLiveID };
