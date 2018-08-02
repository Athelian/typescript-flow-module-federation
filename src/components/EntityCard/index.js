// @flow
import * as React from 'react';
import { injectUid } from 'utils/id';
import { CardStyle, SelectableCardStyle } from './style';
import Actions from './Actions';
import CornerIcon from './CornerIcon';

type Props = {
  children: React.Node,
  icon: string,
  color: string,
  actions?: Array<React.Node>,
  showActionsOnHover?: boolean,
  selectable?: boolean,
  disabled?: boolean,
  selected?: boolean,
  onSelect?: () => void,
  style?: Object,
};

type State = {
  actionsAreShown: boolean,
};

const TOGGLE_TIMEOUT = 500;

export default class Card extends React.Component<Props, State> {
  static defaultProps = {
    actions: [],
    showActionsOnHover: false,
    selectable: false,
    disabled: false,
    selected: false,
    onSelect: () => {},
    style: {},
  };

  state = {
    actionsAreShown: false,
  };

  onMouseOver = () => {
    this.updateActionVisibility(true);
  };

  onMouseOut = () => {
    this.updateActionVisibility(false);
  };

  updateActionVisibility = (shown: boolean) => {
    const { showActionsOnHover } = this.props;
    if (!showActionsOnHover) return;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(() => {
      this.setState({ actionsAreShown: shown });
    }, TOGGLE_TIMEOUT);
  };

  toggleActionVisibility = () => {
    this.setState(previous => ({ actionsAreShown: !previous.actionsAreShown }));
  };

  timeout: ?TimeoutID;

  render() {
    const {
      children,
      icon,
      color,
      actions,
      showActionsOnHover,
      selectable,
      disabled,
      selected,
      onSelect,
      style,
    } = this.props;

    const { actionsAreShown } = this.state;

    const arrayOfAction = actions && actions.map(node => injectUid({ node }));

    return (
      <div
        style={style}
        className={CardStyle(!!disabled, !!selected, !!selectable)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onFocus={this.onMouseOver}
        onBlur={this.onMouseOut}
      >
        {!disabled && (
          <Actions
            actions={arrayOfAction}
            visible={actionsAreShown}
            onClick={this.toggleActionVisibility}
          />
        )}
        <CornerIcon
          icon={icon}
          color={color}
          disabled={disabled}
          selectable={selectable}
          selected={selected}
          showActionsOnHover={showActionsOnHover}
          onClick={this.toggleActionVisibility}
        />
        {!disabled &&
          selectable && (
            <div className={SelectableCardStyle} onClick={onSelect} role="presentation" />
          )}
        {children}
      </div>
    );
  }
}
