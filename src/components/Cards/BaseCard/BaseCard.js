// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import OutsideClickHandler from 'components/OutsideClickHandler';
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
  wrapperClassName: string | Function,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
  children: React.Node,
};

type State = {
  actionsAreShown: boolean,
};

const defaultProps = {
  actions: [],
  showActionsOnHover: false,
  selectable: false,
  disabled: false,
  readOnly: false,
  selected: false,
  onSelect: () => {},
  wrapperClassName: '',
};

export default class BaseCard extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      actionsAreShown: false,
    };

    this.cornerIcon = React.createRef();
  }

  toggleActions = () => {
    const { actionsAreShown } = this.state;

    this.setState({ actionsAreShown: !actionsAreShown });
  };

  openActions = () => {
    this.setState({ actionsAreShown: true });
  };

  closeActions = () => {
    this.setState({ actionsAreShown: false });
  };

  cornerIcon: { current: ?HTMLButtonElement };

  render() {
    const {
      icon,
      color,
      actions,
      showActionsOnHover,
      selectable,
      disabled,
      readOnly,
      selected,
      onSelect,
      wrapperClassName,
      children,
      ...rest
    } = this.props;

    const { actionsAreShown } = this.state;

    const cardStyle = CardStyle(disabled, readOnly);
    return (
      <div
        className={cx(cardStyle, wrapperClassName)}
        onMouseOver={() => {
          if (showActionsOnHover) {
            this.openActions();
          }
        }}
        onFocus={() => {
          if (showActionsOnHover) {
            this.openActions();
          }
        }}
        onMouseOut={() => {
          if (showActionsOnHover) {
            this.closeActions();
          }
        }}
        onBlur={() => {
          if (showActionsOnHover) {
            this.closeActions();
          }
        }}
        {...rest}
      >
        {!disabled &&
          actions.length > 0 && (
            <OutsideClickHandler
              onOutsideClick={this.closeActions}
              ignoreClick={!actionsAreShown}
              ignoreElements={
                this.cornerIcon && this.cornerIcon.current ? [this.cornerIcon.current] : []
              }
            >
              <Actions visible={actionsAreShown}>
                {React.Children.map(actions, action => action)}
              </Actions>
            </OutsideClickHandler>
          )}
        {icon &&
          icon.length && (
            <CornerIcon
              ref={this.cornerIcon}
              icon={icon}
              color={color}
              disabled={disabled}
              readOnly={readOnly}
              selectable={selectable}
              selected={selected}
              onClick={this.toggleActions}
            />
          )}
        {children}
        {!disabled &&
          selectable && (
            <div
              className={SelectableCardStyle(!!selected)}
              onClick={onSelect}
              role="presentation"
            />
          )}
      </div>
    );
  }
}
