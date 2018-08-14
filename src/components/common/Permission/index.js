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

const defaultProps = {
  permissions: 'rw',
};

export default class Permission extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    const { permissions } = props;
    if (permissions) {
      this.state = {
        isWrite: permissions.includes(WRITE),
        isRead: permissions.includes(READ),
      };
    } else {
      this.state = {
        isWrite: false,
        isRead: false,
      };
    }
  }

  render() {
    const { children } = this.props;
    return children(this.state);
  }
}
