// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { PONoItemStyle } from './style';

type OptionalProps = {
  disabled: boolean,
};

type Props = OptionalProps & {
  selected: boolean,
  onToggle: Function,
  children: React.Node,
};

const defaultProps = {
  disabled: false,
};

class PONoGridViewItem extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { selected, onToggle, children, disabled } = this.props;

    return (
      <div
        className={PONoItemStyle(selected)}
        onClick={!disabled ? onToggle : noop}
        role="presentation"
      >
        {children}
      </div>
    );
  }
}

export default PONoGridViewItem;
