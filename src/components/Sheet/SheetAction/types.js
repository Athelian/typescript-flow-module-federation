// @flow
import * as React from 'react';

export type ActionComponentProps = {|
  entity: { id: string, type: string },
  item: Object,
  onDone: () => void,
|};

export type ActionConfig = {|
  component: ActionComponentProps => React.Node,
  permissions: ((string) => boolean) => boolean,
|};

export type ActionRequest = {|
  action: string,
  entity: { id: string, type: string },
  ownedBy: string,
  item: Object,
|};

export type DoAction = ActionRequest => void;
