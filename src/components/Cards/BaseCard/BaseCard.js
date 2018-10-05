// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { injectUid } from 'utils/id';
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
    this.parsedActions = props.actions.map(node => injectUid({ node }));
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

  parsedActions: Array<{ id: string, node: React.Node }>;

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
      >
        {!disabled &&
          actions.length > 0 && (
            <OutsideClickHandler
              onOutsideClick={this.closeActions}
              ignoreElements={
                this.cornerIcon && this.cornerIcon.current ? [this.cornerIcon.current] : []
              }
            >
              <Actions visible={actionsAreShown} actions={this.parsedActions} />
            </OutsideClickHandler>
          )}
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
