// @flow
import * as React from 'react';
import { READ, WRITE } from './constant';
import type { PermissionProps } from './type.js.flow';

type Props = PermissionProps & {
  children: Function,
};

type State = {
  isRead: boolean,
  isWrite: boolean,
};

export default class Permission extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isWrite: props.permissions.includes(WRITE),
      isRead: props.permissions.includes(READ),
    };
  }

  render() {
    const { children } = this.props;
    return children(this.state);
  }
}
