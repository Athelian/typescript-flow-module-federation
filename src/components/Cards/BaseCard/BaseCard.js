// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { omit } from 'utils/fp';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Icon from 'components/Icon';
import {
  CardStyle,
  SelectableCardStyle,
  BadgeStyle,
  BadgeContainer,
  CommentStyle,
  CustomDocumentIcon,
  NewBadgeStyle,
} from './style';
import Actions from './Actions';
import CornerIcon from './CornerIcon';

type Props = {|
  icon: ?string,
  color: string,
  actions: Array<React.Node>,
  showActionsOnHover: boolean,
  forceShowActions: boolean,
  selectable: boolean,
  isArchived: boolean,
  disabled: boolean,
  readOnly: boolean,
  selected: boolean,
  onSelect: Function,
  invertCornerIcon: boolean,
  wrapperClassName: string | Function,
  id: ?string,
  showBadge: boolean,
  filesUnreadCount?: number,
  notificationUnseenCount?: number,
  logsUnreadCount?: number,
  flattenCornerIcon: boolean,
  children: React.Node,
  onClick?: Function,
  notificationPosition: string,
|};

type State = {
  actionsAreShown: boolean,
};

const defaultProps = {
  icon: null,
  color: '',
  actions: [],
  showActionsOnHover: false,
  forceShowActions: false,
  selectable: false,
  isArchived: false,
  disabled: false,
  readOnly: false,
  selected: false,
  onSelect: () => {},
  invertCornerIcon: false,
  wrapperClassName: '',
  id: '',
  showBadge: false,
  flattenCornerIcon: false,
  notificationPosition: '18px',
};

export default class BaseCard extends React.Component<Props, State> {
  cornerIcon: { current: HTMLButtonElement | null } = React.createRef();

  static defaultProps = defaultProps;

  state = {
    actionsAreShown: false,
  };

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

  render() {
    const {
      icon,
      color,
      actions,
      showActionsOnHover,
      forceShowActions,
      selectable,
      isArchived,
      disabled,
      readOnly,
      selected,
      onSelect,
      invertCornerIcon: invert,
      wrapperClassName,
      children,
      id,
      showBadge,
      filesUnreadCount,
      notificationUnseenCount,
      logsUnreadCount,
      flattenCornerIcon,
      notificationPosition,
      ...rest
    } = this.props;

    const { actionsAreShown } = this.state;

    const cardStyle = CardStyle({ disabled, readOnly, isArchived });
    return (
      <div
        id={id}
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
        {...omit(['onRemove', 'onClone'], rest)}
      >
        {!disabled && actions.length > 0 && (
          <OutsideClickHandler
            onOutsideClick={this.closeActions}
            ignoreClick={!forceShowActions && !actionsAreShown}
            ignoreElements={
              this.cornerIcon && this.cornerIcon.current ? [this.cornerIcon.current] : []
            }
          >
            <Actions visible={forceShowActions || actionsAreShown}>
              {React.Children.map(actions, action => action)}
            </Actions>
          </OutsideClickHandler>
        )}
        {icon && (
          <CornerIcon
            ref={this.cornerIcon}
            icon={icon}
            color={color}
            disabled={disabled}
            readOnly={readOnly}
            selectable={selectable}
            selected={selected}
            onClick={this.toggleActions}
            invert={invert}
            flatten={flattenCornerIcon}
          />
        )}
        {showBadge && <span className={BadgeStyle} />}
        <div className={BadgeContainer(notificationPosition)}>
          {!!logsUnreadCount && logsUnreadCount > 0 && (
            <span className={CommentStyle(logsUnreadCount >= 99 ? '10px' : '12px')}>
              <Icon icon="COMMENTS" />
              <span>
                {logsUnreadCount >= 99 ? '99' : logsUnreadCount}
                {logsUnreadCount >= 99 && '+'}
              </span>
            </span>
          )}
          {!!filesUnreadCount && filesUnreadCount > 0 && (
            <span className={CustomDocumentIcon(filesUnreadCount >= 99 ? '10px' : '12px')}>
              <span>
                {filesUnreadCount >= 99 ? '99' : filesUnreadCount}
                {filesUnreadCount >= 99 && '+'}
              </span>
            </span>
          )}
          {!!notificationUnseenCount && notificationUnseenCount > 0 && (
            <span className={NewBadgeStyle(notificationUnseenCount >= 99 ? '10px' : '12px')}>
              <span>
                {notificationUnseenCount >= 99 ? '99' : notificationUnseenCount}
                {notificationUnseenCount >= 99 && '+'}
              </span>
            </span>
          )}
        </div>
        {children}
        {!disabled && selectable && (
          <div
            className={SelectableCardStyle(!!selected, flattenCornerIcon)}
            onClick={onSelect}
            role="presentation"
          />
        )}
      </div>
    );
  }
}
