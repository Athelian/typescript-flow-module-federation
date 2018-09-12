// @flow
import * as React from 'react';
import { injectUid } from 'utils/id';
import { CardStyle, SelectableCardStyle } from './style';
import Actions from './Actions';
import CornerIcon from './CornerIcon';

type OptionalProps = {
  actions: Array<React.Node>,
  showActionsOnHover: boolean,
  selectable: boolean,
  disabled: boolean,
  readOnly: boolean,
  selected: boolean,
  onSelect: Function,
  wrapperClassName: string,
};

type Props = OptionalProps & {
  children: React.Node,
  icon: string,
  color: string,
};

type State = {
  actionsAreShown: boolean,
};

const TOGGLE_TIMEOUT = 500;

export default class BaseCard extends React.Component<Props, State> {
  static defaultProps = {
    actions: [],
    showActionsOnHover: false,
    selectable: false,
    disabled: false,
    readOnly: false,
    selected: false,
    onSelect: () => {},
    wrapperClassName: '',
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
      readOnly,
      selected,
      onSelect,
      wrapperClassName = '',
    } = this.props;

    const { actionsAreShown } = this.state;

    const arrayOfAction = actions && actions.map(node => injectUid({ node }));

    return (
      <div
        className={`${CardStyle(disabled, readOnly)} ${wrapperClassName}`}
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
          readOnly={readOnly}
          selectable={selectable}
          selected={selected}
          showActionsOnHover={showActionsOnHover}
          onClick={this.toggleActionVisibility}
        />
        {!disabled &&
          selectable && (
            <div
              className={SelectableCardStyle(!!selected)}
              onClick={onSelect}
              role="presentation"
            />
          )}
        {children}
      </div>
    );
  }
}
